import type { ScryptParams, HashResult, SecurityLevel } from './types.js';
/**
 * Hash a password using scrypt (synchronous)
 *
 * @param password - The password to hash
 * @param salt - Salt as hex string, or undefined to generate random salt
 * @param params - Scrypt parameters, defaults to standard security
 * @returns Hash result with metadata
 */
export declare function hashPasswordSync(password: string, salt?: string, params?: ScryptParams): HashResult;
/**
 * Hash a password using scrypt (asynchronous)
 *
 * @param password - The password to hash
 * @param salt - Salt as hex string, or undefined to generate random salt
 * @param params - Scrypt parameters, defaults to standard security
 * @returns Promise resolving to hash result with metadata
 */
export declare function hashPassword(password: string, salt?: string, params?: ScryptParams): Promise<HashResult>;
/**
 * Verify a password against a hash
 *
 * @param password - The password to verify
 * @param expectedHash - The expected hash as hex string
 * @param salt - The salt used for hashing
 * @param params - The scrypt parameters used
 * @returns True if password matches
 */
export declare function verifyPassword(password: string, expectedHash: string, salt: string, params: ScryptParams): Promise<boolean>;
/**
 * Get scrypt parameters for a security level
 *
 * @param level - Security level
 * @returns Scrypt parameters for the level
 */
export declare function getScryptParams(level: SecurityLevel): ScryptParams;
/**
 * Create login parameters for client
 *
 * @param securityLevel - Security level to use
 * @returns Login parameters with fresh salt and form token
 */
export declare function createLoginParams(securityLevel?: SecurityLevel): {
    algorithm: "scrypt";
    params: ScryptParams;
    salt: string;
    formToken: string;
};
/**
 * Hash password with client-side parameters (for registration/login)
 * This is the function that should be used by frontends
 *
 * @param password - User's password
 * @param salt - Salt from server
 * @param params - Scrypt parameters from server
 * @returns Promise resolving to hex-encoded hash
 */
export declare function clientHashPassword(password: string, salt: string, params: ScryptParams): Promise<string>;
/**
 * Double-hash a client hash for server storage
 * This adds an additional layer of security on the server side
 *
 * @param clientHash - Hash received from client
 * @param serverSalt - Server-side salt for storage
 * @param params - Scrypt parameters for server hashing
 * @returns Promise resolving to server hash for database storage
 */
export declare function serverHashPassword(clientHash: string, serverSalt: string, params?: ScryptParams): Promise<string>;
