import { randomBytes } from '@noble/hashes/utils';
import { SCRYPT_LIMITS, SALT_LENGTH } from './constants.js';
/**
 * Converts Uint8Array to hexadecimal string
 */
export function bytesToHex(bytes) {
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
/**
 * Converts hexadecimal string to Uint8Array
 */
export function hexToBytes(hex) {
    if (hex.length % 2 !== 0) {
        throw new Error('Invalid hex string: odd length');
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes;
}
/**
 * Generates cryptographically secure random salt
 */
export function generateSalt() {
    return bytesToHex(randomBytes(SALT_LENGTH));
}
/**
 * Generates a random form token for CSRF protection
 */
export function generateFormToken() {
    return bytesToHex(randomBytes(16)); // 128-bit token
}
/**
 * Validates scrypt parameters
 */
export function validateScryptParams(params) {
    const { N, r, p, dkLen } = params;
    // Check N is power of 2
    if (N <= 0 || (N & (N - 1)) !== 0) {
        throw new Error('N must be a power of 2');
    }
    // Check ranges
    if (N < SCRYPT_LIMITS.MIN_N || N > SCRYPT_LIMITS.MAX_N) {
        throw new Error(`N must be between ${SCRYPT_LIMITS.MIN_N} and ${SCRYPT_LIMITS.MAX_N}`);
    }
    if (r < SCRYPT_LIMITS.MIN_R || r > SCRYPT_LIMITS.MAX_R) {
        throw new Error(`r must be between ${SCRYPT_LIMITS.MIN_R} and ${SCRYPT_LIMITS.MAX_R}`);
    }
    if (p < SCRYPT_LIMITS.MIN_P || p > SCRYPT_LIMITS.MAX_P) {
        throw new Error(`p must be between ${SCRYPT_LIMITS.MIN_P} and ${SCRYPT_LIMITS.MAX_P}`);
    }
    if (dkLen < SCRYPT_LIMITS.MIN_DKLEN || dkLen > SCRYPT_LIMITS.MAX_DKLEN) {
        throw new Error(`dkLen must be between ${SCRYPT_LIMITS.MIN_DKLEN} and ${SCRYPT_LIMITS.MAX_DKLEN}`);
    }
    // Check memory requirements don't exceed reasonable limits
    const memoryRequired = 128 * N * r;
    const maxMemory = 1024 * 1024 * 1024; // 1GB
    if (memoryRequired > maxMemory) {
        throw new Error(`Memory requirement (${Math.round(memoryRequired / 1024 / 1024)}MB) exceeds limit (${maxMemory / 1024 / 1024}MB)`);
    }
}
/**
 * Detects crypto capabilities of current environment
 */
export function detectCryptoCapabilities() {
    const isNode = typeof process !== 'undefined' && process.versions?.node;
    const isBrowser = typeof window !== 'undefined';
    const hasWebCrypto = typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined';
    const secureContext = (typeof globalThis !== 'undefined' && globalThis.isSecureContext) ||
        (typeof window !== 'undefined' && window.isSecureContext) ||
        true; // Assume secure in Node.js
    return {
        webCrypto: hasWebCrypto,
        secureContext,
        nodeEnvironment: Boolean(isNode),
        browserEnvironment: isBrowser
    };
}
/**
 * Estimates hashing time based on parameters
 * This is a rough estimate based on noble-hashes benchmarks
 */
export function estimateHashingTime(params) {
    const { N, r, p } = params;
    // Base time for N=2^16, r=8, p=1 is approximately 200ms
    const baseTime = 200;
    const baseN = 2 ** 16;
    // Time scales roughly linearly with N, r, and p
    const timeMs = baseTime * (N / baseN) * (r / 8) * p;
    return Math.round(timeMs);
}
/**
 * Creates a timing-safe comparison function
 */
export function timingSafeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}
/**
 * Securely clears a string from memory (best effort)
 */
export function clearString(str) {
    // In JavaScript, we can't truly clear strings from memory
    // This is a best-effort approach for documentation purposes
    if (typeof str === 'string') {
        // @ts-ignore - Attempting to clear string reference
        str = '';
    }
}
