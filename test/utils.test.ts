import { describe, it, expect } from 'vitest';
import {
  bytesToHex,
  hexToBytes,
  generateSalt,
  generateFormToken,
  validateScryptParams,
  detectCryptoCapabilities,
  estimateHashingTime,
  timingSafeEqual
} from '../src/utils.js';
import { SCRYPT_PRESETS } from '../src/constants.js';

describe('Utility Functions', () => {
  describe('bytesToHex', () => {
    it('should convert bytes to hex string', () => {
      const bytes = new Uint8Array([0x00, 0x01, 0xff, 0xab]);
      const hex = bytesToHex(bytes);
      
      expect(hex).toBe('0001ffab');
    });

    it('should handle empty array', () => {
      const bytes = new Uint8Array([]);
      const hex = bytesToHex(bytes);
      
      expect(hex).toBe('');
    });
  });

  describe('hexToBytes', () => {
    it('should convert hex string to bytes', () => {
      const hex = '0001ffab';
      const bytes = hexToBytes(hex);
      
      expect(Array.from(bytes)).toEqual([0x00, 0x01, 0xff, 0xab]);
    });

    it('should handle empty string', () => {
      const hex = '';
      const bytes = hexToBytes(hex);
      
      expect(bytes.length).toBe(0);
    });

    it('should throw on odd length hex string', () => {
      expect(() => hexToBytes('abc')).toThrow('Invalid hex string: odd length');
    });
  });

  describe('round trip conversion', () => {
    it('should maintain data integrity', () => {
      const original = new Uint8Array([1, 2, 3, 255, 0, 128]);
      const hex = bytesToHex(original);
      const restored = hexToBytes(hex);
      
      expect(Array.from(restored)).toEqual(Array.from(original));
    });
  });

  describe('generateSalt', () => {
    it('should generate 64-character hex string', () => {
      const salt = generateSalt();
      
      expect(salt).toHaveLength(64);
      expect(salt).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate unique salts', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      
      expect(salt1).not.toBe(salt2);
    });
  });

  describe('generateFormToken', () => {
    it('should generate 32-character hex string', () => {
      const token = generateFormToken();
      
      expect(token).toHaveLength(32);
      expect(token).toMatch(/^[0-9a-f]+$/);
    });

    it('should generate unique tokens', () => {
      const token1 = generateFormToken();
      const token2 = generateFormToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateScryptParams', () => {
    it('should accept valid parameters', () => {
      expect(() => validateScryptParams(SCRYPT_PRESETS.standard)).not.toThrow();
      expect(() => validateScryptParams(SCRYPT_PRESETS.development)).not.toThrow();
      expect(() => validateScryptParams(SCRYPT_PRESETS.high)).not.toThrow();
    });

    it('should reject N that is not power of 2', () => {
      const params = { ...SCRYPT_PRESETS.standard, N: 1000 };
      expect(() => validateScryptParams(params)).toThrow('N must be a power of 2');
    });

    it('should reject N that is too small', () => {
      const params = { ...SCRYPT_PRESETS.standard, N: 512 };
      expect(() => validateScryptParams(params)).toThrow('N must be between');
    });

    it('should reject N that is too large', () => {
      const params = { ...SCRYPT_PRESETS.standard, N: 2 ** 25 };
      expect(() => validateScryptParams(params)).toThrow('N must be between');
    });

    it('should reject invalid r values', () => {
      const params1 = { ...SCRYPT_PRESETS.standard, r: 0 };
      const params2 = { ...SCRYPT_PRESETS.standard, r: 100 };
      
      expect(() => validateScryptParams(params1)).toThrow('r must be between');
      expect(() => validateScryptParams(params2)).toThrow('r must be between');
    });

    it('should reject invalid p values', () => {
      const params1 = { ...SCRYPT_PRESETS.standard, p: 0 };
      const params2 = { ...SCRYPT_PRESETS.standard, p: 100 };
      
      expect(() => validateScryptParams(params1)).toThrow('p must be between');
      expect(() => validateScryptParams(params2)).toThrow('p must be between');
    });

    it('should reject invalid dkLen values', () => {
      const params1 = { ...SCRYPT_PRESETS.standard, dkLen: 8 };
      const params2 = { ...SCRYPT_PRESETS.standard, dkLen: 256 };
      
      expect(() => validateScryptParams(params1)).toThrow('dkLen must be between');
      expect(() => validateScryptParams(params2)).toThrow('dkLen must be between');
    });
  });

  describe('detectCryptoCapabilities', () => {
    it('should return capabilities object', () => {
      const capabilities = detectCryptoCapabilities();
      
      expect(capabilities).toHaveProperty('webCrypto');
      expect(capabilities).toHaveProperty('secureContext');
      expect(capabilities).toHaveProperty('nodeEnvironment');
      expect(capabilities).toHaveProperty('browserEnvironment');
      
      expect(typeof capabilities.webCrypto).toBe('boolean');
      expect(typeof capabilities.secureContext).toBe('boolean');
      expect(typeof capabilities.nodeEnvironment).toBe('boolean');
      expect(typeof capabilities.browserEnvironment).toBe('boolean');
    });
  });

  describe('estimateHashingTime', () => {
    it('should return positive number', () => {
      const time = estimateHashingTime(SCRYPT_PRESETS.standard);
      
      expect(typeof time).toBe('number');
      expect(time).toBeGreaterThan(0);
    });

    it('should estimate higher time for higher N', () => {
      const time1 = estimateHashingTime(SCRYPT_PRESETS.development);
      const time2 = estimateHashingTime(SCRYPT_PRESETS.standard);
      
      expect(time2).toBeGreaterThan(time1);
    });
  });

  describe('timingSafeEqual', () => {
    it('should return true for equal strings', () => {
      const str = 'hello world';
      expect(timingSafeEqual(str, str)).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(timingSafeEqual('hello', 'world')).toBe(false);
    });

    it('should return false for different length strings', () => {
      expect(timingSafeEqual('hello', 'hello world')).toBe(false);
    });

    it('should be timing safe (basic test)', () => {
      // This is a basic test - real timing attack testing would be more complex
      const str1 = 'a'.repeat(1000);
      const str2 = 'b'.repeat(1000);
      const str3 = 'b'.repeat(999) + 'a';
      
      expect(timingSafeEqual(str1, str2)).toBe(false);
      expect(timingSafeEqual(str1, str3)).toBe(false);
    });
  });
});