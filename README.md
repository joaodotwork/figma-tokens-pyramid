# @joaodotwork/figma-tokens-pyramid

> Extract, transform, and build design tokens from Figma Variables API

Transform Figma variables into production-ready design tokens for web, React Native, and other platforms. Includes automated developer package generation.

## Features

- 🎨 **Extract from Figma** - Pull variables directly from Figma's Variables API
- 🔄 **Transform tokens** - Convert to Style Dictionary format and other standards
- 🏗️ **Build for platforms** - Generate CSS, SCSS, JavaScript, and React Native outputs
- 📦 **Developer packages** - Auto-generate distributable token packages
- ⚙️ **Configurable** - Customize collections, modes, and output formats
- 🧪 **Validated** - Built-in token validation and health checks

## Installation

```bash
npm install @joaodotwork/figma-tokens-pyramid
```

Or install globally for CLI usage:

```bash
npm install -g @joaodotwork/figma-tokens-pyramid
```

## Quick Start

### 1. Initialize Configuration

```bash
figma-tokens init
```

This creates a `figma-tokens.config.js` file.

### 2. Configure Your Figma File

Edit `figma-tokens.config.js`:

```javascript
export default {
  figma: {
    fileKey: process.env.FIGMA_FILE_KEY,
    accessToken: process.env.FIGMA_ACCESS_TOKEN,
    collections: {
      reference: 'VariableCollectionId:xxx:xxx',
      system: 'VariableCollectionId:xxx:xxx',
      component: 'VariableCollectionId:xxx:xxx'
    },
    modes: {
      reference: 'modeId:xxx',
      system: 'modeId:xxx',
      component: 'modeId:xxx'
    }
  },
  output: {
    directory: './tokens',
    formats: ['json', 'js', 'css', 'scss']
  },
  platforms: ['web', 'react-native']
}
```

### 3. Extract and Build Tokens

```bash
# Extract from Figma, transform, and build all outputs
figma-tokens sync

# Or run steps individually
figma-tokens extract
figma-tokens transform
figma-tokens build --platform web
```

## CLI Commands

### `figma-tokens init`
Initialize configuration file

### `figma-tokens extract`
Extract tokens from Figma

### `figma-tokens transform`
Transform tokens to Style Dictionary format

### `figma-tokens build`
Build platform-specific outputs

Options:
- `--platform <platform>` - Build for specific platform (web, react-native)
- `--output <dir>` - Custom output directory

### `figma-tokens sync`
Run extract + transform + build in one command

Options:
- `--create-package` - Also create developer package

### `figma-tokens create-package`
Create distributable developer package

### `figma-tokens validate`
Validate token structure and references

## Programmatic API

```javascript
import { FigmaTokenExtractor } from '@joaodotwork/figma-tokens-pyramid';

const extractor = new FigmaTokenExtractor({
  figmaToken: process.env.FIGMA_ACCESS_TOKEN,
  fileKey: 'your-file-key',
  collections: {
    reference: 'VariableCollectionId:xxx:xxx',
    system: 'VariableCollectionId:xxx:xxx'
  }
});

// Extract tokens
const tokens = await extractor.extract();

// Transform tokens
const transformed = await extractor.transform(tokens);

// Build for web
await extractor.build(transformed, { platform: 'web' });

// Create developer package
await extractor.createDeveloperPackage(transformed);
```

## Configuration

See the [Configuration Guide](./docs/configuration.md) for detailed configuration options.

### Developer Package Configuration

```javascript
export default {
  // ... other config ...

  developerPackage: {
    enabled: true,
    output: './developer-packages',
    packageName: 'design-tokens-hb25-optimized',
    version: '1.0.0',
    autoVersion: {
      strategy: 'datestamp' // 'datestamp' | 'semver' | 'git-tag'
    },
    archive: {
      enabled: true,
      format: 'zip'
    }
  }
}
```

## Examples

See the [examples](./examples) directory for:
- Basic usage
- Custom configuration
- Custom transformers
- Developer package creation
- Platform-specific builds

## Development

```bash
# Clone the repository
git clone https://github.com/joaodotwork/figma-tokens-pyramid.git
cd figma-tokens-pyramid

# Install dependencies
npm install

# Run tests
npm test

# Watch mode for development
npm run dev
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md).

## License

MIT © joaodotwork

## Related

- [Figma Variables API Documentation](https://www.figma.com/developers/api#variables-endpoints)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)

## Support

- [Documentation](./docs)
- [Issues](https://github.com/joaodotwork/figma-tokens-pyramid/issues)
- [Discussions](https://github.com/joaodotwork/figma-tokens-pyramid/discussions)
