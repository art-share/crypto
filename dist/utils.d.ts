import type { ScryptParams, CryptoCapabilities } from './types.js';
/**
 * Converts Uint8Array to hexadecimal string
 */
export declare function bytesToHex(bytes: Uint8Array): string;
/**
 * Converts hexadecimal string to Uint8Array
 */
export declare function hexToBytes(hex: string): Uint8Array;
/**
 * Generates cryptographically secure random salt
 */
export declare function generateSalt(): string;
/**
 * Generates a random form token for CSRF protection
 */
export declare function generateFormToken(): string;
/**
 * Validates scrypt parameters
 */
export declare function validateScryptParams(params: ScryptParams): void;
/**
 * Detects crypto capabilities of current environment
 */
export declare function detectCryptoCapabilities(): CryptoCapabilities;
/**
 * Estimates hashing time based on parameters
 * This is a rough estimate based on noble-hashes benchmarks
 */
export declare function estimateHashingTime(params: ScryptParams): number;
/**
 * Creates a timing-safe comparison function
 */
export declare function timingSafeEqual(a: string, b: string): boolean;
/**
 * Securely clears a string from memory (best effort)
 */
export declare function clearString(str: string): void;
