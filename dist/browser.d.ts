/**
 * Browser specific exports
 *
 * This module provides browser optimized versions of crypto functions
 * and includes browser-specific utilities
 */
export * from './index.js';
/**
 * Check if the current browser environment supports secure crypto operations
 */
export declare function isSecureBrowserEnvironment(): boolean;
/**
 * Get browser crypto environment status for debugging
 */
export declare function getBrowserCryptoStatus(): {
    isSecure: boolean;
    recommendations: {
        webCrypto: string | null;
        secureContext: string | null;
        browser: string | null;
    };
    webCrypto: boolean;
    secureContext: boolean;
    nodeEnvironment: boolean;
    browserEnvironment: boolean;
};
