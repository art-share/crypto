/**
 * Node.js specific exports
 * 
 * This module provides Node.js optimized versions of crypto functions
 * where applicable, while maintaining the same API
 */

// Re-export everything from main module
export * from './index.js';

// Node.js specific utilities could go here
// For now, noble-hashes works well in both environments