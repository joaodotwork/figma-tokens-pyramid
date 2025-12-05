/**
 * Transform Command
 *
 * Transform tokens to Style Dictionary format
 */

import chalk from 'chalk';
import ora from 'ora';
import { FigmaTokensExtractor } from '../../index.js';
import fs from 'fs/promises';
import path from 'path';

export async function transformCommand(options) {
  const spinner = ora();

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const extractor = await FigmaTokensExtractor.fromConfig(options.config);
    spinner.succeed('Configuration loaded');

    // Read input tokens
    const inputPath = options.input || path.join(
      extractor.config.output?.directory || './tokens',
      'index.json'
    );

    spinner.start(`Reading tokens from ${inputPath}...`);
    const tokensData = await fs.readFile(inputPath, 'utf8');
    const tokens = JSON.parse(tokensData);
    spinner.succeed('Tokens loaded');

    // Transform tokens
    spinner.start('Transforming to Style Dictionary format...');
    const transformed = await extractor.transform(tokens);
    spinner.succeed('Tokens transformed');

    // Determine output path
    const outputDir = options.output || './style-dictionary';
    const outputPath = path.join(outputDir, 'tokens.json');

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write transformed tokens
    spinner.start('Writing transformed tokens...');
    await fs.writeFile(outputPath, JSON.stringify(transformed, null, 2));
    spinner.succeed(`Transformed tokens written to ${outputPath}`);

    console.log('');
    console.log(chalk.green('✓ Transform complete!'));
  } catch (error) {
    spinner.fail('Transform failed');
    console.error(chalk.red(error.message));
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
