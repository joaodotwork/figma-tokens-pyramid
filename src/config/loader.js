/**
 * Configuration Loader
 *
 * Loads and validates configuration from user's config file
 */

import { pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { getDefaultConfig } from './defaults.js';

// Load environment variables from current working directory
dotenv.config({ path: path.join(process.cwd(), '.env') });

export class ConfigLoader {
  /**
   * Load configuration from file
   * @param {string} configPath - Path to config file
   * @returns {Promise<object>} Loaded configuration
   */
  async load(configPath = 'figma-tokens.config.js') {
    try {
      // Try to resolve the config file
      const resolvedPath = path.resolve(process.cwd(), configPath);

      // Check if file exists
      try {
        await fs.access(resolvedPath);
      } catch (error) {
        throw new Error(`Config file not found: ${configPath}`);
      }

      // Import the config file
      const fileUrl = pathToFileURL(resolvedPath).href;
      const module = await import(fileUrl);
      const userConfig = module.default || module;

      // Merge with defaults
      const config = this.mergeWithDefaults(userConfig);

      // Validate configuration
      this.validate(config);

      return config;
    } catch (error) {
      throw new Error(`Failed to load config: ${error.message}`);
    }
  }

  /**
   * Merge user config with defaults
   * @param {object} userConfig - User configuration
   * @returns {object} Merged configuration
   */
  mergeWithDefaults(userConfig) {
    const defaults = getDefaultConfig();

    return {
      ...defaults,
      ...userConfig,
      figma: {
        ...defaults.figma,
        ...userConfig.figma
      },
      output: {
        ...defaults.output,
        ...userConfig.output
      },
      developerPackage: {
        ...defaults.developerPackage,
        ...userConfig.developerPackage
      }
    };
  }

  /**
   * Validate configuration
   * @param {object} config - Configuration to validate
   * @throws {Error} If configuration is invalid
   */
  validate(config) {
    // Required fields
    if (!config.figma) {
      throw new Error('Missing required config: figma');
    }

    if (!config.figma.accessToken) {
      throw new Error('Missing required config: figma.accessToken');
    }

    if (!config.figma.fileKey) {
      throw new Error('Missing required config: figma.fileKey');
    }

    // Validate collections if provided
    if (config.figma.collections) {
      const required = ['reference', 'system'];
      for (const key of required) {
        if (!config.figma.collections[key]) {
          console.warn(`Warning: Missing collection ID for '${key}'`);
        }
      }
    }

    // Validate modes if provided
    if (config.figma.modes) {
      const required = ['reference', 'system'];
      for (const key of required) {
        if (!config.figma.modes[key]) {
          console.warn(`Warning: Missing mode ID for '${key}'`);
        }
      }
    }
  }
}

/**
 * Helper function to load config
 * @param {string} configPath - Optional config path
 * @returns {Promise<object>} Loaded configuration
 */
export async function loadConfig(configPath) {
  const loader = new ConfigLoader();
  return loader.load(configPath);
}
