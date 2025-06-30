# @art-share/crypto

Shared cryptographic utilities for the Artshare platform, providing quantum-resistant password hashing using scrypt.

## Features

- 🔒 **Quantum-Resistant**: Uses scrypt algorithm for memory-hard password hashing
- 🌐 **Cross-Platform**: Works in both Node.js and browser environments
- 🛡️ **Security Levels**: Multiple security presets from development to paranoid
- 🔐 **Double Hashing**: Client-side + server-side hashing for enhanced security
- 🎯 **CSRF Protection**: Built-in form token generation
- 📦 **TypeScript**: Full TypeScript support with comprehensive types
- ⚡ **Performance**: Optimized builds for different environments

## Installation

```bash
npm install @art-share/crypto
```

## Quick Start

### Basic Password Hashing

```typescript
import { hashPassword, verifyPassword } from '@art-share/crypto';

// Hash a password
const result = await hashPassword('user-password-123');
console.log(result.hash); // hex string
console.log(result.salt); // hex string
console.log(result.params); // scrypt parameters

// Verify a password
const isValid = await verifyPassword(
  'user-password-123',
  result.hash,
  result.salt,
  result.params
);
console.log(isValid); // true
```

### Client-Server Authentication Flow

```typescript
import { createLoginParams, clientHashPassword, serverHashPassword } from '@art-share/crypto';

// Server: Generate login parameters
const loginParams = createLoginParams('standard');
// Send to client: { algorithm: 'scrypt', params: {...}, salt: '...', formToken: '...' }

// Client: Hash password with server parameters
const clientHash = await clientHashPassword(
  'user-password',
  loginParams.salt,
  loginParams.params
);
// Send to server: { username: '...', hashedPassword: clientHash, formToken: loginParams.formToken }

// Server: Double-hash for storage
const serverHash = await serverHashPassword(clientHash, userSalt);
// Store serverHash in database
```

## Security Levels

Choose the appropriate security level based on your needs:

```typescript
import { getScryptParams, SCRYPT_PRESETS } from '@art-share/crypto';

// Development: Fast but weak (N=16384, ~50ms)
const devParams = getScryptParams('development');

// Standard: Balanced security (N=65536, ~200ms) - Recommended
const standardParams = getScryptParams('standard');

// High: Strong security (N=262144, ~800ms)
const highParams = getScryptParams('high');

// Paranoid: Maximum security (N=1048576, ~3200ms)
const paranoidParams = getScryptParams('paranoid');
```

## Browser Usage

```typescript
import { isSecureBrowserEnvironment, getBrowserCryptoStatus } from '@art-share/crypto/browser';

// Check if browser environment is secure
if (isSecureBrowserEnvironment()) {
  // Safe to perform crypto operations
  const hash = await clientHashPassword(password, salt, params);
} else {
  // Show warning about insecure environment
  const status = getBrowserCryptoStatus();
  console.log(status.recommendations);
}
```

## Node.js Usage

```typescript
import { hashPassword, serverHashPassword } from '@art-share/crypto/node';

// All functions work the same in Node.js
const result = await hashPassword('password');
```

## API Reference

### Core Functions

#### `hashPassword(password, salt?, params?): Promise<HashResult>`
Hash a password with optional salt and parameters.

#### `hashPasswordSync(password, salt?, params?): HashResult`
Synchronous version of `hashPassword`.

#### `verifyPassword(password, hash, salt, params): Promise<boolean>`
Verify a password against a hash.

#### `clientHashPassword(password, salt, params): Promise<string>`
Hash password for client-server transmission.

#### `serverHashPassword(clientHash, serverSalt, params?): Promise<string>`
Double-hash client hash for server storage.

#### `createLoginParams(securityLevel?): LoginParams`
Generate login parameters with fresh salt and CSRF token.

### Utility Functions

#### `generateSalt(): string`
Generate cryptographically secure random salt.

#### `generateFormToken(): string`
Generate CSRF protection token.

#### `validateScryptParams(params): void`
Validate scrypt parameters (throws on invalid).

#### `detectCryptoCapabilities(): CryptoCapabilities`
Detect crypto capabilities of current environment.

#### `estimateHashingTime(params): number`
Estimate hashing time in milliseconds.

#### `timingSafeEqual(a, b): boolean`
Timing-safe string comparison.

## Types

```typescript
interface ScryptParams {
  N: number;     // CPU/Memory cost (power of 2)
  r: number;     // Block size
  p: number;     // Parallelism
  dkLen: number; // Derived key length
}

interface LoginParams {
  algorithm: 'scrypt';
  params: ScryptParams;
  salt: string;
  formToken: string;
}

interface HashResult {
  hash: string;
  salt: string;
  params: ScryptParams;
  timestamp: number;
}

type SecurityLevel = 'development' | 'standard' | 'high' | 'paranoid';
```

## Security Considerations

1. **Never send plain passwords**: Always hash on client-side before transmission
2. **Use HTTPS**: Crypto operations should only be performed in secure contexts
3. **Validate tokens**: Always verify CSRF tokens on the server
4. **Choose appropriate security level**: Higher levels provide better security but slower performance
5. **Store server hashes**: Never store client hashes directly in the database

## Performance

Approximate hashing times on modern hardware:

- **Development**: ~50ms (N=16384)
- **Standard**: ~200ms (N=65536) 
- **High**: ~800ms (N=262144)
- **Paranoid**: ~3200ms (N=1048576)

Times may vary based on hardware and JavaScript engine.

## Browser Compatibility

- Chrome/Edge 60+
- Firefox 55+
- Safari 11+
- Node.js 18+

Requires Web Crypto API and secure context (HTTPS) for optimal browser performance.

## License

MIT - see LICENSE file for details.

## Contributing

See the main [Artshare repository](https://github.com/art-share/artshare) for contribution guidelines.