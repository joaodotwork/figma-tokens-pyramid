# Basic Usage Example

This example shows the simplest way to use `@joaodotwork/figma-tokens-pyramid`.

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Figma credentials:
   ```
   FIGMA_ACCESS_TOKEN=your_token
   FIGMA_FILE_KEY=your_file_key
   ```

3. Create `figma-tokens.config.js`:
   ```bash
   npx figma-tokens init
   ```

4. Update the config with your collection and mode IDs.

## Run

```bash
# Extract and transform tokens
npx figma-tokens sync

# Or run steps individually
npx figma-tokens extract
npx figma-tokens transform
```

## Output

Tokens will be written to:
- `./tokens/index.json` - Raw extracted tokens
- `./style-dictionary/tokens.json` - Transformed tokens
