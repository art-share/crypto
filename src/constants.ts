import type { ScryptParams, SecurityLevel } from './types.js';

/**
 * Default scrypt parameters for different security levels
 * Based on OWASP recommendations and noble-hashes performance data
 */
export const SCRYPT_PRESETS: Record<SecurityLevel, ScryptParams> = {
  // Fast hashing for development/testing (weak security)
  development: {
    N: 2 ** 14,  // 16384 - ~50ms
    r: 8,
    p: 1,
    dkLen: 32
  },
  
  // Standard security for most applications
  standard: {
    N: 2 ** 16,  // 65536 - ~200ms
    r: 8,
    p: 1,
    dkLen: 32
  },
  
  // High security for sensitive applications
  high: {
    N: 2 ** 18,  // 262144 - ~800ms
    r: 8,
    p: 1,
    dkLen: 32
  },
  
  // Paranoid security for maximum protection
  paranoid: {
    N: 2 ** 20,  // 1048576 - ~3200ms
    r: 8,
    p: 1,
    dkLen: 32
  }
};

/**
 * Default security level
 */
export const DEFAULT_SECURITY_LEVEL: SecurityLevel = 'standard';

/**
 * Default scrypt parameters (standard security)
 */
export const DEFAULT_SCRYPT_PARAMS: ScryptParams = SCRYPT_PRESETS[DEFAULT_SECURITY_LEVEL];

/**
 * Salt length in bytes (256 bits)
 */
export const SALT_LENGTH = 32;

/**
 * Minimum requirements for scrypt parameters
 */
export const SCRYPT_LIMITS = {
  MIN_N: 2 ** 10,    // 1024
  MAX_N: 2 ** 24,    // 16777216
  MIN_R: 1,
  MAX_R: 64,
  MIN_P: 1,
  MAX_P: 64,
  MIN_DKLEN: 16,
  MAX_DKLEN: 128
} as const;

/**
 * Library version for compatibility checking
 */
export const VERSION = '1.0.0';

/**
 * Supported algorithms
 */
export const SUPPORTED_ALGORITHMS = ['scrypt'] as const;