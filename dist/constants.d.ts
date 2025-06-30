import type { ScryptParams, SecurityLevel } from './types.js';
/**
 * Default scrypt parameters for different security levels
 * Based on OWASP recommendations and noble-hashes performance data
 */
export declare const SCRYPT_PRESETS: Record<SecurityLevel, ScryptParams>;
/**
 * Default security level
 */
export declare const DEFAULT_SECURITY_LEVEL: SecurityLevel;
/**
 * Default scrypt parameters (standard security)
 */
export declare const DEFAULT_SCRYPT_PARAMS: ScryptParams;
/**
 * Salt length in bytes (256 bits)
 */
export declare const SALT_LENGTH = 32;
/**
 * Minimum requirements for scrypt parameters
 */
export declare const SCRYPT_LIMITS: {
    readonly MIN_N: number;
    readonly MAX_N: number;
    readonly MIN_R: 1;
    readonly MAX_R: 64;
    readonly MIN_P: 1;
    readonly MAX_P: 64;
    readonly MIN_DKLEN: 16;
    readonly MAX_DKLEN: 128;
};
/**
 * Library version for compatibility checking
 */
export declare const VERSION = "1.0.0";
/**
 * Supported algorithms
 */
export declare const SUPPORTED_ALGORITHMS: readonly ["scrypt"];
