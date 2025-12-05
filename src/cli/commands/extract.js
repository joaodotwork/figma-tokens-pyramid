/**
 * Extract Command
 *
 * Extract tokens from Figma
 */

import chalk from 'chalk';
import ora from 'ora';
import { FigmaTokensExtractor } from '../../index.js';
import fs from 'fs/promises';
import path from 'path';

export async function extractCommand(options) {
  const spinner = ora();

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const extractor = await FigmaTokensExtractor.fromConfig(options.config);
    spinner.succeed('Configuration loaded');

    // Extract tokens
    spinner.start('Extracting tokens from Figma...');
    const tokens = await extractor.extract();
    spinner.succeed('Tokens extracted');

    // Determine output path
    const outputDir = options.output || extractor.config.output?.directory || './tokens';
    const outputPath = path.join(outputDir, 'index.json');

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write tokens
    spinner.start('Writing tokens to file...');
    await fs.writeFile(outputPath, JSON.stringify(tokens, null, 2));
    spinner.succeed(`Tokens written to ${outputPath}`);

    // Show stats
    console.log('');
    console.log(chalk.cyan('Token Statistics:'));
    const stats = getTokenStats(tokens);
    Object.entries(stats).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${chalk.bold(count)} tokens`);
    });

    console.log('');
    console.log(chalk.green('✓ Extract complete!'));
  } catch (error) {
    spinner.fail('Extract failed');
    console.error(chalk.red(error.message));
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

function getTokenStats(tokens) {
  const stats = {};

  Object.entries(tokens).forEach(([collection, categories]) => {
    stats[collection] = countTokens(categories);
  });

  return stats;
}

function countTokens(obj) {
  let count = 0;

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') {
      if (value.value !== undefined || value.type !== undefined) {
        count++;
      } else {
        count += countTokens(value);
      }
    }
  }

  return count;
}
