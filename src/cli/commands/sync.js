/**
 * Sync Command
 *
 * Extract, transform, and optionally build tokens
 */

import chalk from 'chalk';
import ora from 'ora';
import { FigmaTokensExtractor } from '../../index.js';
import fs from 'fs/promises';
import path from 'path';

export async function syncCommand(options) {
  const spinner = ora();

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const extractor = await FigmaTokensExtractor.fromConfig(options.config);
    spinner.succeed('Configuration loaded');

    console.log('');
    console.log(chalk.bold.blue('=== Token Sync Workflow ==='));
    console.log('');

    // Step 1: Extract
    spinner.start('Step 1/2: Extracting tokens from Figma...');
    const tokens = await extractor.extract();
    spinner.succeed('Tokens extracted from Figma');

    // Write raw tokens
    const tokensDir = extractor.config.output?.directory || './tokens';
    await fs.mkdir(tokensDir, { recursive: true });
    await fs.writeFile(
      path.join(tokensDir, 'index.json'),
      JSON.stringify(tokens, null, 2)
    );

    // Show stats
    const stats = getTokenStats(tokens);
    console.log(chalk.dim('  Token counts:'));
    Object.entries(stats).forEach(([collection, count]) => {
      console.log(chalk.dim(`    ${collection}: ${count}`));
    });

    // Step 2: Transform
    spinner.start('Step 2/2: Transforming to Style Dictionary format...');
    const transformed = await extractor.transform(tokens);
    spinner.succeed('Tokens transformed');

    // Write transformed tokens
    const sdDir = './style-dictionary';
    await fs.mkdir(sdDir, { recursive: true });
    await fs.writeFile(
      path.join(sdDir, 'tokens.json'),
      JSON.stringify(transformed, null, 2)
    );

    console.log('');
    console.log(chalk.green('✓ Sync complete!'));
    console.log('');
    console.log(chalk.cyan('Files written:'));
    console.log(`  ${tokensDir}/index.json`);
    console.log(`  ${sdDir}/tokens.json`);

    // Developer package if requested
    if (options.createPackage) {
      console.log('');
      console.log(chalk.yellow('Developer package creation coming in Phase 3!'));
    }
  } catch (error) {
    spinner.fail('Sync failed');
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
