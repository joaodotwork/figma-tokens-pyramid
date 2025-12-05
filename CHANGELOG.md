# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-05

### Added

#### Core Functionality
- **Figma API Client** - Extract variables from Figma's Variables API
- **Token Filter** - Filter collections and exclude deleted variables
- **Token Extractor** - Organize tokens hierarchically
- **Alias Resolver** - Resolve variable aliases and references
- **Style Dictionary Transformer** - Transform to Style Dictionary format
- **Configuration System** - Flexible config file with validation

#### CLI Commands
- `init` - Initialize configuration file
- `extract` - Extract tokens from Figma
- `transform` - Transform to Style Dictionary format
- `sync` - Full workflow (extract + transform)
- `create-package` - Auto-generate developer packages
- `validate` - Validate token structure (placeholder)
- `build` - Build platform outputs (placeholder)

#### Developer Package Builder ⭐
- Auto-generate timestamped package directories
- Copy token files by collection
- Auto-generate package.json with exports
- Auto-generate README.md with statistics
- Create .zip archives automatically
- Token counting and statistics
- Configurable versioning strategies
- Template string interpolation

#### Features
- Colorized terminal output with progress spinners
- Environment variable loading (.env support)
- Token statistics display
- Error handling with helpful messages
- npm link support for local testing

### Technical Details
- ES modules (type: "module")
- Node.js 18+ required
- Dependencies: commander, inquirer, chalk, ora, archiver, node-fetch, dotenv
- No breaking changes (initial release)

### Documentation
- Comprehensive README with examples
- Configuration template
- Basic usage example
- Migration documentation (for nordlys-pyramid project)

### Notes
- Initial public release
- Tested with real Figma data (481 tokens extracted successfully)
- Developer package builder eliminates ~15 minutes of manual work per package

[0.1.0]: https://github.com/joaodotwork/figma-tokens-pyramid/releases/tag/v0.1.0
