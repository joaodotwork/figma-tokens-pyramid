/**
 * Init Command
 *
 * Initialize configuration file
 */

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initCommand(options) {
  const configPath = path.join(process.cwd(), 'figma-tokens.config.js');

  try {
    // Check if config already exists
    try {
      await fs.access(configPath);
      if (!options.force) {
        console.log(chalk.yellow('⚠️  Config file already exists: figma-tokens.config.js'));
        console.log(chalk.dim('Use --force to overwrite'));
        process.exit(1);
      }
    } catch (error) {
      // File doesn't exist, continue
    }

    // Copy template to current directory
    const templatePath = path.join(__dirname, '../../../templates/figma-tokens.config.js');
    const template = await fs.readFile(templatePath, 'utf8');
    await fs.writeFile(configPath, template);

    console.log(chalk.green('✓ Created figma-tokens.config.js'));
    console.log('');
    console.log(chalk.cyan('Next steps:'));
    console.log('  1. Edit figma-tokens.config.js');
    console.log('  2. Set FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY in .env');
    console.log('  3. Configure collection and mode IDs');
    console.log('  4. Run: figma-tokens sync');
  } catch (error) {
    console.error(chalk.red('✗ Failed to create config file'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}
