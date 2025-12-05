#!/usr/bin/env node

/**
 * Figma Tokens CLI
 *
 * Command-line interface for figma-tokens-pyramid
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from '../src/cli/commands/init.js';
import { extractCommand } from '../src/cli/commands/extract.js';
import { transformCommand } from '../src/cli/commands/transform.js';
import { buildCommand } from '../src/cli/commands/build.js';
import { syncCommand } from '../src/cli/commands/sync.js';
import { validateCommand } from '../src/cli/commands/validate.js';
import { createPackageCommand } from '../src/cli/commands/create-package.js';

const program = new Command();

program
  .name('figma-tokens')
  .description('Extract, transform, and build design tokens from Figma Variables API')
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('Initialize configuration file')
  .option('-f, --force', 'Overwrite existing config file')
  .action(initCommand);

// Extract command
program
  .command('extract')
  .description('Extract tokens from Figma')
  .option('-c, --config <path>', 'Path to config file', 'figma-tokens.config.js')
  .option('-o, --output <path>', 'Output directory')
  .action(extractCommand);

// Transform command
program
  .command('transform')
  .description('Transform tokens to Style Dictionary format')
  .option('-c, --config <path>', 'Path to config file', 'figma-tokens.config.js')
  .option('-i, --input <path>', 'Input tokens file')
  .option('-o, --output <path>', 'Output directory')
  .action(transformCommand);

// Build command
program
  .command('build')
  .description('Build platform-specific outputs')
  .option('-c, --config <path>', 'Path to config file', 'figma-tokens.config.js')
  .option('-p, --platform <platform>', 'Platform to build (web, react-native)')
  .option('-o, --output <path>', 'Output directory')
  .action(buildCommand);

// Sync command
program
  .command('sync')
  .description('Extract, transform, and build tokens (all-in-one)')
  .option('-c, --config <path>', 'Path to config file', 'figma-tokens.config.js')
  .option('--create-package', 'Also create developer package')
  .action(syncCommand);

// Create package command
program
  .command('create-package')
  .description('Create distributable developer package')
  .option('-c, --config <path>', 'Path to config file', 'figma-tokens.config.js')
  .option('-v, --version <version>', 'Package version')
  .option('--no-zip', 'Skip creating archive')
  .action(createPackageCommand);

// Validate command
program
  .command('validate')
  .description('Validate token structure and references')
  .option('-c, --config <path>', 'Path to config file', 'figma-tokens.config.js')
  .option('-i, --input <path>', 'Input tokens file')
  .action(validateCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
