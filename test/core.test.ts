import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  hashPasswordSync,
  verifyPassword,
  clientHashPassword,
  serverHashPassword,
  createLoginParams,
  getScryptParams
} from '../src/core.js';
import { SCRYPT_PRESETS } from '../src/constants.js';

describe('Core Crypto Functions', () => {
  const testPassword = 'test-password-123';
  const testSalt = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

  describe('hashPassword', () => {
    it('should hash password with default parameters', async () => {
      const result = await hashPassword(testPassword);
      
      expect(result.hash).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(result.salt).toHaveLength(64); // 32 bytes = 64 hex chars
      expect(result.params).toEqual(SCRYPT_PRESETS.standard);
      expect(result.timestamp).toBeTypeOf('number');
    });

    it('should hash password with custom salt', async () => {
      const result = await hashPassword(testPassword, testSalt);
      
      expect(result.salt).toBe(testSalt);
      expect(result.hash).toHaveLength(64);
    });

    it('should hash password with custom parameters', async () => {
      const customParams = SCRYPT_PRESETS.development;
      const result = await hashPassword(testPassword, testSalt, customParams);
      
      expect(result.params).toEqual(customParams);
      expect(result.hash).toHaveLength(64);
    });

    it('should produce different hashes with different salts', async () => {
      const result1 = await hashPassword(testPassword, testSalt);
      const result2 = await hashPassword(testPassword, testSalt + '00');
      
      expect(result1.hash).not.toBe(result2.hash);
    });

    it('should produce same hash with same inputs', async () => {
      const result1 = await hashPassword(testPassword, testSalt);
      const result2 = await hashPassword(testPassword, testSalt);
      
      expect(result1.hash).toBe(result2.hash);
    });
  });

  describe('hashPasswordSync', () => {
    it('should hash password synchronously', () => {
      const result = hashPasswordSync(testPassword, testSalt);
      
      expect(result.hash).toHaveLength(64);
      expect(result.salt).toBe(testSalt);
    });

    it('should produce same result as async version', async () => {
      const syncResult = hashPasswordSync(testPassword, testSalt);
      const asyncResult = await hashPassword(testPassword, testSalt);
      
      expect(syncResult.hash).toBe(asyncResult.hash);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const result = await hashPassword(testPassword, testSalt);
      const isValid = await verifyPassword(testPassword, result.hash, result.salt, result.params);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const result = await hashPassword(testPassword, testSalt);
      const isValid = await verifyPassword('wrong-password', result.hash, result.salt, result.params);
      
      expect(isValid).toBe(false);
    });
  });

  describe('clientHashPassword', () => {
    it('should return hex string', async () => {
      const hash = await clientHashPassword(testPassword, testSalt, SCRYPT_PRESETS.development);
      
      expect(typeof hash).toBe('string');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]+$/);
    });
  });

  describe('serverHashPassword', () => {
    it('should double-hash client hash', async () => {
      const clientHash = await clientHashPassword(testPassword, testSalt, SCRYPT_PRESETS.development);
      const serverHash = await serverHashPassword(clientHash, testSalt);
      
      expect(typeof serverHash).toBe('string');
      expect(serverHash).toHaveLength(64);
      expect(serverHash).not.toBe(clientHash);
    });
  });

  describe('getScryptParams', () => {
    it('should return correct parameters for each security level', () => {
      expect(getScryptParams('development')).toEqual(SCRYPT_PRESETS.development);
      expect(getScryptParams('standard')).toEqual(SCRYPT_PRESETS.standard);
      expect(getScryptParams('high')).toEqual(SCRYPT_PRESETS.high);
      expect(getScryptParams('paranoid')).toEqual(SCRYPT_PRESETS.paranoid);
    });

    it('should return copy of parameters (not reference)', () => {
      const params = getScryptParams('standard');
      params.N = 999;
      
      expect(getScryptParams('standard').N).not.toBe(999);
    });
  });

  describe('createLoginParams', () => {
    it('should create login parameters with default security level', () => {
      const params = createLoginParams();
      
      expect(params.algorithm).toBe('scrypt');
      expect(params.params).toEqual(SCRYPT_PRESETS.standard);
      expect(params.salt).toHaveLength(64);
      expect(params.formToken).toHaveLength(32);
    });

    it('should create login parameters with custom security level', () => {
      const params = createLoginParams('development');
      
      expect(params.params).toEqual(SCRYPT_PRESETS.development);
    });

    it('should generate unique salts and tokens', () => {
      const params1 = createLoginParams();
      const params2 = createLoginParams();
      
      expect(params1.salt).not.toBe(params2.salt);
      expect(params1.formToken).not.toBe(params2.formToken);
    });
  });
});