/**
 * Create Package Command
 *
 * Create distributable developer package
 */

import chalk from 'chalk';
import ora from 'ora';
import { FigmaTokensExtractor } from '../../index.js';
import fs from 'fs/promises';
import path from 'path';

export async function createPackageCommand(options) {
  const spinner = ora();

  try {
    // Load configuration
    spinner.start('Loading configuration...');
    const extractor = await FigmaTokensExtractor.fromConfig(options.config);
    spinner.succeed('Configuration loaded');

    // Check if developer package is enabled
    if (!extractor.config.developerPackage?.enabled) {
      console.log(chalk.yellow('⚠️  Developer package creation is disabled in config'));
      console.log(chalk.dim('Set developerPackage.enabled = true in figma-tokens.config.js'));
      return;
    }

    // Read tokens
    const tokensDir = extractor.config.output?.directory || './tokens';
    const tokensPath = path.join(tokensDir, 'index.json');

    spinner.start('Reading tokens...');
    const tokensData = await fs.readFile(tokensPath, 'utf8');
    const tokens = JSON.parse(tokensData);
    spinner.succeed('Tokens loaded');

    // Create package
    spinner.start('Creating developer package...');
    const result = await extractor.createDeveloperPackage(tokens);
    spinner.succeed('Developer package created');

    // Display results
    console.log('');
    console.log(chalk.green('✓ Developer package created successfully!'));
    console.log('');
    console.log(chalk.cyan('Package Details:'));
    console.log(`  Path: ${chalk.bold(result.path)}`);
    if (result.archivePath) {
      console.log(`  Archive: ${chalk.bold(result.archivePath)}`);
    }
    console.log('');
    console.log(chalk.cyan('Token Statistics:'));
    Object.entries(result.stats.byCollection).forEach(([collection, count]) => {
      console.log(`  ${collection}: ${chalk.bold(count)} tokens`);
    });
    console.log(`  ${chalk.bold('Total:')} ${chalk.bold(result.stats.total)} tokens`);
    console.log('');
  } catch (error) {
    spinner.fail('Package creation failed');
    console.error(chalk.red(error.message));
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
