/**
 * Browser specific exports
 * 
 * This module provides browser optimized versions of crypto functions
 * and includes browser-specific utilities
 */

// Re-export everything from main module
export * from './index.js';

import { detectCryptoCapabilities } from './utils.js';

/**
 * Check if the current browser environment supports secure crypto operations
 */
export function isSecureBrowserEnvironment(): boolean {
  const capabilities = detectCryptoCapabilities();
  
  return capabilities.browserEnvironment && 
         capabilities.secureContext && 
         capabilities.webCrypto;
}

/**
 * Get browser crypto environment status for debugging
 */
export function getBrowserCryptoStatus() {
  const capabilities = detectCryptoCapabilities();
  
  return {
    ...capabilities,
    isSecure: isSecureBrowserEnvironment(),
    recommendations: {
      webCrypto: !capabilities.webCrypto ? 'Web Crypto API not available' : null,
      secureContext: !capabilities.secureContext ? 'Switch to HTTPS for secure context' : null,
      browser: !capabilities.browserEnvironment ? 'Not running in browser' : null
    }
  };
}