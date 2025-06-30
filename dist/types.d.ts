/**
 * Scrypt algorithm parameters for password hashing
 */
export interface ScryptParams {
    /** CPU/Memory cost parameter (must be power of 2) */
    N: number;
    /** Block size parameter */
    r: number;
    /** Parallelism parameter */
    p: number;
    /** Derived key length in bytes */
    dkLen: number;
}
/**
 * Login parameters provided by the server
 */
export interface LoginParams {
    /** Hashing algorithm identifier */
    algorithm: 'scrypt';
    /** Scrypt parameters for hashing */
    params: ScryptParams;
    /** Random salt for this login attempt */
    salt: string;
    /** CSRF protection token */
    formToken: string;
}
/**
 * Hashing result with metadata
 */
export interface HashResult {
    /** The computed hash as hex string */
    hash: string;
    /** Salt used for hashing */
    salt: string;
    /** Parameters used for hashing */
    params: ScryptParams;
    /** Timestamp when hash was computed */
    timestamp: number;
}
/**
 * Security levels for scrypt parameters
 */
export type SecurityLevel = 'development' | 'standard' | 'high' | 'paranoid';
/**
 * Platform-specific crypto capabilities
 */
export interface CryptoCapabilities {
    /** Whether Web Crypto API is available */
    webCrypto: boolean;
    /** Whether running in secure context (HTTPS) */
    secureContext: boolean;
    /** Whether running in Node.js environment */
    nodeEnvironment: boolean;
    /** Whether running in browser environment */
    browserEnvironment: boolean;
}
