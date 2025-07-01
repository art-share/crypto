# Publishing @art-share/crypto to GitHub Package Registry

## Overview

This guide explains how to properly publish the crypto library to GitHub Package Registry for version-controlled distribution.

## Prerequisites

1. GitHub Personal Access Token with `write:packages` scope
2. Package version updated in package.json
3. All tests passing

## Setup Publishing Configuration

### 1. Update package.json

Add the following to `libs/crypto/package.json`:

```json
{
  "name": "@art-share/crypto",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/art-share/crypto.git"
  }
}
```

### 2. Create Publishing .npmrc

Create `.npmrc` in the crypto directory:
```
@art-share:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_NPM_PUBLISH_TOKEN}
```

### 3. Set Publishing Token

```bash
export GITHUB_NPM_PUBLISH_TOKEN=ghp_your_write_packages_token_here
```

## Publishing Process

### 1. Build and Test

```bash
cd libs/crypto
npm run build
npm test
```

### 2. Version Bump

```bash
# For patch release (1.0.0 -> 1.0.1)
npm version patch

# For minor release (1.0.0 -> 1.1.0)
npm version minor

# For major release (1.0.0 -> 2.0.0)
npm version major
```

### 3. Publish to Registry

```bash
npm publish
```

### 4. Push Tags

```bash
git push origin main --tags
```

## Updating Dependent Services

After publishing, update all services to use the published version:

### 1. Update package.json

Change from:
```json
"@art-share/crypto": "github:art-share/crypto#main"
```

To:
```json
"@art-share/crypto": "^1.0.0"
```

### 2. Update and Test

```bash
# For each service (api, chat, etc.)
./dev api npm update @art-share/crypto
./dev api npm test
```

## Version Strategy

- **Patch (1.0.x)**: Bug fixes, security patches
- **Minor (1.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes

## Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Benefits of Package Registry

1. **Version Control**: Pin specific versions in production
2. **Rollback Capability**: Easy revert to previous versions
3. **Change Management**: Control when updates are applied
4. **Build Reproducibility**: Same version = same code
5. **Security**: Immutable published versions

## Migration Checklist

- [ ] Add publishConfig to package.json
- [ ] Create version tag (v1.0.0)
- [ ] Publish initial version
- [ ] Update API service package.json
- [ ] Update Chat service package.json
- [ ] Update frontend services if needed
- [ ] Test all services with published version
- [ ] Update CI/CD pipelines
- [ ] Document version update process

## Troubleshooting

**403 Forbidden on publish**
- Check token has `write:packages` scope
- Verify package name matches repository

**Package not found after publish**
- Wait 1-2 minutes for registry propagation
- Check package visibility settings

**Version conflicts**
- Never republish same version
- Always bump version for changes