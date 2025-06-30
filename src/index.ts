/**
 * @art-share/crypto
 * 
 * Shared cryptographic utilities for Artshare platform
 * Provides quantum-resistant password hashing using scrypt
 * 
 * Features:
 * - Cross-platform compatibility (Node.js + Browser)
 * - Multiple security levels
 * - CSRF protection tokens
 * - Double hashing for enhanced security
 * - TypeScript support
 */

// Core functionality
export {
  hashPassword,
  hashPasswordSync,
  verifyPassword,
  clientHashPassword,
  serverHashPassword,
  createLoginParams,
  getScryptParams
} from './core.js';

// Utilities
export {
  generateSalt,
  generateFormToken,
  validateScryptParams,
  detectCryptoCapabilities,
  estimateHashingTime,
  timingSafeEqual,
  bytesToHex,
  hexToBytes
} from './utils.js';

// Types
export type {
  ScryptParams,
  LoginParams,
  HashResult,
  SecurityLevel,
  CryptoCapabilities
} from './types.js';

// Constants
export {
  SCRYPT_PRESETS,
  DEFAULT_SCRYPT_PARAMS,
  DEFAULT_SECURITY_LEVEL,
  SALT_LENGTH,
  SCRYPT_LIMITS,
  VERSION,
  SUPPORTED_ALGORITHMS
} from './constants.js';

// Default export for convenience
import { 
  hashPassword, 
  verifyPassword, 
  createLoginParams,
  clientHashPassword,
  serverHashPassword 
} from './core.js';

export default {
  hashPassword,
  verifyPassword,
  createLoginParams,
  clientHashPassword,
  serverHashPassword
};