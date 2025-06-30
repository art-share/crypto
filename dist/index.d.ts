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
export { hashPassword, hashPasswordSync, verifyPassword, clientHashPassword, serverHashPassword, createLoginParams, getScryptParams } from './core.js';
export { generateSalt, generateFormToken, validateScryptParams, detectCryptoCapabilities, estimateHashingTime, timingSafeEqual, bytesToHex, hexToBytes } from './utils.js';
export type { ScryptParams, LoginParams, HashResult, SecurityLevel, CryptoCapabilities } from './types.js';
export { SCRYPT_PRESETS, DEFAULT_SCRYPT_PARAMS, DEFAULT_SECURITY_LEVEL, SALT_LENGTH, SCRYPT_LIMITS, VERSION, SUPPORTED_ALGORITHMS } from './constants.js';
import { hashPassword, verifyPassword, createLoginParams, clientHashPassword, serverHashPassword } from './core.js';
declare const _default: {
    hashPassword: typeof hashPassword;
    verifyPassword: typeof verifyPassword;
    createLoginParams: typeof createLoginParams;
    clientHashPassword: typeof clientHashPassword;
    serverHashPassword: typeof serverHashPassword;
};
export default _default;
