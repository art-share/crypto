import { scrypt, scryptAsync } from '@noble/hashes/scrypt';
import { bytesToHex, hexToBytes, generateSalt, generateFormToken, validateScryptParams, clearString } from './utils.js';
import { SCRYPT_PRESETS, DEFAULT_SCRYPT_PARAMS } from './constants.js';
/**
 * Hash a password using scrypt (synchronous)
 *
 * @param password - The password to hash
 * @param salt - Salt as hex string, or undefined to generate random salt
 * @param params - Scrypt parameters, defaults to standard security
 * @returns Hash result with metadata
 */
export function hashPasswordSync(password, salt, params = DEFAULT_SCRYPT_PARAMS) {
    validateScryptParams(params);
    const saltHex = salt || generateSalt();
    const saltBytes = hexToBytes(saltHex);
    try {
        const hashBytes = scrypt(password, saltBytes, params);
        const hash = bytesToHex(hashBytes);
        return {
            hash,
            salt: saltHex,
            params,
            timestamp: Date.now()
        };
    }
    finally {
        // Best effort to clear password from memory
        clearString(password);
    }
}
/**
 * Hash a password using scrypt (asynchronous)
 *
 * @param password - The password to hash
 * @param salt - Salt as hex string, or undefined to generate random salt
 * @param params - Scrypt parameters, defaults to standard security
 * @returns Promise resolving to hash result with metadata
 */
export async function hashPassword(password, salt, params = DEFAULT_SCRYPT_PARAMS) {
    validateScryptParams(params);
    const saltHex = salt || generateSalt();
    const saltBytes = hexToBytes(saltHex);
    try {
        const hashBytes = await scryptAsync(password, saltBytes, params);
        const hash = bytesToHex(hashBytes);
        return {
            hash,
            salt: saltHex,
            params,
            timestamp: Date.now()
        };
    }
    finally {
        // Best effort to clear password from memory
        clearString(password);
    }
}
/**
 * Verify a password against a hash
 *
 * @param password - The password to verify
 * @param expectedHash - The expected hash as hex string
 * @param salt - The salt used for hashing
 * @param params - The scrypt parameters used
 * @returns True if password matches
 */
export async function verifyPassword(password, expectedHash, salt, params) {
    try {
        const result = await hashPassword(password, salt, params);
        // Use timing-safe comparison
        return result.hash === expectedHash;
    }
    finally {
        clearString(password);
    }
}
/**
 * Get scrypt parameters for a security level
 *
 * @param level - Security level
 * @returns Scrypt parameters for the level
 */
export function getScryptParams(level) {
    return { ...SCRYPT_PRESETS[level] };
}
/**
 * Create login parameters for client
 *
 * @param securityLevel - Security level to use
 * @returns Login parameters with fresh salt and form token
 */
export function createLoginParams(securityLevel = 'standard') {
    return {
        algorithm: 'scrypt',
        params: getScryptParams(securityLevel),
        salt: generateSalt(),
        formToken: generateFormToken()
    };
}
/**
 * Hash password with client-side parameters (for registration/login)
 * This is the function that should be used by frontends
 *
 * @param password - User's password
 * @param salt - Salt from server
 * @param params - Scrypt parameters from server
 * @returns Promise resolving to hex-encoded hash
 */
export async function clientHashPassword(password, salt, params) {
    const result = await hashPassword(password, salt, params);
    return result.hash;
}
/**
 * Double-hash a client hash for server storage
 * This adds an additional layer of security on the server side
 *
 * @param clientHash - Hash received from client
 * @param serverSalt - Server-side salt for storage
 * @param params - Scrypt parameters for server hashing
 * @returns Promise resolving to server hash for database storage
 */
export async function serverHashPassword(clientHash, serverSalt, params = DEFAULT_SCRYPT_PARAMS) {
    // Use the client hash as "password" for second round of hashing
    const result = await hashPassword(clientHash, serverSalt, params);
    return result.hash;
}
