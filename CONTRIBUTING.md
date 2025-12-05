# Contributing to @joaodotwork/figma-tokens-pyramid

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/figma-tokens-pyramid.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit with clear messages
7. Push and create a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Link for local testing
npm link

# Test in another project
cd /path/to/test-project
npm link @joaodotwork/figma-tokens-pyramid
```

## Project Structure

```
src/
├── core/           # Core extraction and processing
├── builders/       # Platform and package builders
├── cli/           # CLI commands
├── config/        # Configuration system
├── transformers/  # Token transformers
└── utils/         # Utilities

bin/               # CLI entry point
tests/             # Tests
examples/          # Usage examples
templates/         # Config templates
```

## Code Style

- Use ES modules (`import`/`export`)
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Keep functions focused and small
- Use `async/await` over promises
- Handle errors gracefully

## Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch
```

Currently tests are minimal. Adding tests is a great way to contribute!

## Adding Features

### New CLI Command

1. Create command file in `src/cli/commands/your-command.js`
2. Export async function: `export async function yourCommand(options) { }`
3. Add to `bin/figma-tokens.js`:
   ```javascript
   import { yourCommand } from '../src/cli/commands/your-command.js';

   program
     .command('your-command')
     .description('What your command does')
     .action(yourCommand);
   ```
4. Use `ora` for spinners, `chalk` for colors
5. Handle errors with helpful messages

### New Builder

1. Create builder in `src/builders/your-builder.js`
2. Export class with `build(tokens)` method
3. Document configuration options
4. Add to main `FigmaTokensExtractor` class if needed

### New Transformer

1. Create transformer in `src/transformers/your-transformer.js`
2. Export class with `transform(tokens)` method
3. Document input/output formats

## Commit Messages

Use conventional commits format:

- `feat: add new feature`
- `fix: fix bug`
- `docs: update documentation`
- `refactor: refactor code`
- `test: add tests`
- `chore: update dependencies`

Examples:
- `feat: add web token builder`
- `fix: resolve aliases correctly`
- `docs: update README with examples`

## Pull Requests

- Keep PRs focused on a single feature/fix
- Update documentation as needed
- Add tests for new features
- Ensure tests pass
- Update CHANGELOG.md

## Questions?

- Open an issue for discussion
- Tag with appropriate labels
- Be respectful and constructive

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
