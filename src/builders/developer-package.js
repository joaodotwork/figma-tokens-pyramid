/**
 * Developer Package Builder
 *
 * Automates creation of distributable token packages
 */

import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

export class DeveloperPackageBuilder {
  constructor(config) {
    this.config = config.developerPackage || {};
  }

  /**
   * Build developer package
   * @param {object} tokens - Tokens to package
   * @returns {Promise<object>} Package result
   */
  async build(tokens) {
    if (!this.config.enabled) {
      return null;
    }

    // Create package directory
    const packageDir = await this.createPackageDirectory();

    // Copy token files
    await this.copyTokenFiles(tokens, packageDir);

    // Generate package.json
    await this.generatePackageJson(packageDir);

    // Generate README
    await this.generateReadme(packageDir);

    // Create archive if enabled
    let archivePath = null;
    if (this.config.archive?.enabled !== false) {
      archivePath = await this.createArchive(packageDir);
    }

    // Get stats
    const stats = await this.getTokenStats(packageDir);

    return {
      path: packageDir,
      archivePath,
      stats
    };
  }

  /**
   * Create package directory with timestamp
   * @returns {Promise<string>} Package directory path
   */
  async createPackageDirectory() {
    const dirName = this.generateDirectoryName();
    const outputDir = this.config.output || './developer-packages';
    const fullPath = path.join(outputDir, dirName, 'developer-package');

    await fs.mkdir(fullPath, { recursive: true });

    return fullPath;
  }

  /**
   * Generate directory name based on versioning strategy
   * @returns {string} Directory name
   */
  generateDirectoryName() {
    const strategy = this.config.autoVersion?.strategy || 'datestamp';
    const dateFormat = this.config.autoVersion?.dateFormat || 'YYYYMMDD';

    if (strategy === 'datestamp') {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}-optimized`;
    } else if (strategy === 'semver') {
      return `v${this.config.version}`;
    }

    return new Date().toISOString().split('T')[0].replace(/-/g, '');
  }

  /**
   * Copy token files to package directory
   * @param {object} tokens - Tokens to copy
   * @param {string} packageDir - Package directory
   */
  async copyTokenFiles(tokens, packageDir) {
    const collections = this.config.include || ['reference', 'system', 'component'];

    for (const collection of collections) {
      if (!tokens[collection]) continue;

      const collectionDir = path.join(packageDir, collection);
      await fs.mkdir(collectionDir, { recursive: true });

      // Write each category as a separate JSON file
      for (const [category, categoryTokens] of Object.entries(tokens[collection])) {
        const filePath = path.join(collectionDir, `${category}.json`);
        await fs.writeFile(filePath, JSON.stringify(categoryTokens, null, 2));
      }
    }
  }

  /**
   * Generate package.json
   * @param {string} packageDir - Package directory
   */
  async generatePackageJson(packageDir) {
    const stats = await this.getTokenStats(packageDir);
    const exports = await this.generateExports(packageDir);

    const pkg = {
      name: this.config.packageName || 'design-tokens',
      version: this.getVersion(),
      description: this.interpolateString(
        this.config.packageDescription || 'Design token system with {total} tokens',
        stats
      ),
      main: this.config.exports?.main || './reference/color.json',
      exports,
      files: (this.config.include || ['reference', 'system', 'component']).map(c => `${c}/`).concat('README.md'),
      keywords: this.config.keywords || ['design-tokens', 'design-system'],
      author: this.config.author || '',
      license: this.config.license || 'MIT',
      sideEffects: false
    };

    await fs.writeFile(
      path.join(packageDir, 'package.json'),
      JSON.stringify(pkg, null, 2)
    );
  }

  /**
   * Auto-generate exports from token files
   * @param {string} packageDir - Package directory
   * @returns {Promise<object>} Exports object
   */
  async generateExports(packageDir) {
    const exports = {};
    const collections = this.config.include || ['reference', 'system', 'component'];

    for (const collection of collections) {
      const collectionDir = path.join(packageDir, collection);

      try {
        const files = await fs.readdir(collectionDir);

        for (const file of files) {
          if (file.endsWith('.json')) {
            const name = file.replace('.json', '');
            exports[`./${collection}/${name}`] = `./${collection}/${file}`;
          }
        }
      } catch (error) {
        // Collection directory doesn't exist, skip
      }
    }

    return exports;
  }

  /**
   * Generate README.md
   * @param {string} packageDir - Package directory
   */
  async generateReadme(packageDir) {
    const stats = await this.getTokenStats(packageDir);

    const readme = `# ${this.config.packageName || 'Design Tokens'}

**${stats.total} tokens** across ${Object.keys(stats.byCollection).length} collections.

## Installation

\`\`\`bash
npm install ${this.config.packageName || 'design-tokens'}
\`\`\`

## Usage

\`\`\`javascript
import colors from '${this.config.packageName || 'design-tokens'}/reference/color';
import typography from '${this.config.packageName || 'design-tokens'}/system/typography';
\`\`\`

## Collections

${Object.entries(stats.byCollection).map(([collection, count]) => `- **${collection}**: ${count} tokens`).join('\n')}

## Generated

This package was auto-generated on ${new Date().toLocaleDateString()} using [@joaodotwork/figma-tokens-pyramid](https://github.com/joaodotwork/figma-tokens-pyramid).
`;

    await fs.writeFile(path.join(packageDir, 'README.md'), readme);
  }

  /**
   * Get token statistics
   * @param {string} packageDir - Package directory
   * @returns {Promise<object>} Token stats
   */
  async getTokenStats(packageDir) {
    const stats = {
      total: 0,
      byCollection: {}
    };

    const collections = this.config.include || ['reference', 'system', 'component'];

    for (const collection of collections) {
      const collectionDir = path.join(packageDir, collection);

      try {
        const files = await fs.readdir(collectionDir);
        let collectionCount = 0;

        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = JSON.parse(
              await fs.readFile(path.join(collectionDir, file), 'utf8')
            );
            const count = this.countTokens(content);
            collectionCount += count;
          }
        }

        stats.byCollection[collection] = collectionCount;
        stats.total += collectionCount;
      } catch (error) {
        stats.byCollection[collection] = 0;
      }
    }

    return stats;
  }

  /**
   * Count tokens in an object recursively
   * @param {object} obj - Object to count tokens in
   * @returns {number} Token count
   */
  countTokens(obj) {
    let count = 0;

    for (const value of Object.values(obj)) {
      if (value && typeof value === 'object') {
        if (value.value !== undefined || value.type !== undefined) {
          // This is a token
          count++;
        } else {
          // This is a nested object, recurse
          count += this.countTokens(value);
        }
      }
    }

    return count;
  }

  /**
   * Create zip archive
   * @param {string} packageDir - Package directory to archive
   * @returns {Promise<string>} Archive path
   */
  async createArchive(packageDir) {
    const parentDir = path.dirname(packageDir);
    const dirName = path.basename(parentDir);

    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const archiveName = `${dateStr}-${this.config.packageName || 'design-tokens'}-package.zip`;
    const archivePath = path.join(parentDir, archiveName);

    return new Promise((resolve, reject) => {
      const output = createWriteStream(archivePath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve(archivePath));
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(packageDir, 'developer-package');
      archive.finalize();
    });
  }

  /**
   * Get version string
   * @returns {string} Version
   */
  getVersion() {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    return `${this.config.version || '1.0.0'}-${dateStr}`;
  }

  /**
   * Interpolate variables in string
   * @param {string} template - Template string
   * @param {object} vars - Variables to interpolate
   * @returns {string} Interpolated string
   */
  interpolateString(template, vars) {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return vars[key] !== undefined ? vars[key] : match;
    });
  }
}
