/**
 * Figma Tokens Pyramid
 *
 * Main entry point for programmatic API
 */

import { FigmaClient } from './core/figma-client.js';
import { TokenFilter } from './core/token-filter.js';
import { TokenExtractor } from './core/token-extractor.js';
import { AliasResolver } from './core/alias-resolver.js';
import { StyleDictionaryTransformer } from './transformers/style-dictionary.js';
import { DeveloperPackageBuilder } from './builders/developer-package.js';
import { loadConfig } from './config/loader.js';

export class FigmaTokensExtractor {
  constructor(config) {
    this.config = config;
    // Pass figma config to client
    this.client = new FigmaClient(config.figma || config);
    this.filter = new TokenFilter(config.figma || config);
    this.extractor = new TokenExtractor(config.figma || config);
    this.aliasResolver = new AliasResolver();
    this.transformer = new StyleDictionaryTransformer();
    this.packageBuilder = new DeveloperPackageBuilder(config);
  }

  /**
   * Create from config file
   * @param {string} configPath - Path to config file
   * @returns {Promise<FigmaTokensExtractor>} Instance
   */
  static async fromConfig(configPath) {
    const config = await loadConfig(configPath);
    return new FigmaTokensExtractor(config);
  }

  /**
   * Extract tokens from Figma
   * @returns {Promise<object>} Raw tokens
   */
  async extract() {
    // Fetch variables from Figma
    const variablesResponse = await this.client.fetchVariables();

    // Filter to target collections
    const filteredResponse = this.filter.filterVariables(variablesResponse);

    // Extract tokens into hierarchical structure
    const tokens = this.extractor.extract(filteredResponse);

    // Resolve aliases
    const allVariables = variablesResponse.meta?.variables || {};
    const resolvedTokens = this.aliasResolver.resolveAliases(tokens, allVariables);

    // Clean for output
    const cleanedTokens = this.aliasResolver.cleanTokensForOutput(resolvedTokens);

    return cleanedTokens;
  }

  /**
   * Transform tokens to Style Dictionary format
   * @param {object} tokens - Tokens to transform
   * @returns {object} Transformed tokens
   */
  async transform(tokens) {
    return this.transformer.transform(tokens);
  }

  /**
   * Build tokens for platforms
   * @param {object} tokens - Tokens to build
   * @param {object} options - Build options
   * @returns {Promise<void>}
   */
  async build(tokens, options = {}) {
    // This will be implemented with platform builders
    throw new Error('Build not yet implemented');
  }

  /**
   * Create developer package
   * @param {object} tokens - Tokens to package
   * @param {object} options - Package options
   * @returns {Promise<object>} Package result
   */
  async createDeveloperPackage(tokens, options = {}) {
    return this.packageBuilder.build(tokens);
  }

  /**
   * Full sync: extract + transform
   * @returns {Promise<object>} Transformed tokens
   */
  async sync() {
    const tokens = await this.extract();
    const transformed = await this.transform(tokens);
    return transformed;
  }
}

// Export individual classes for advanced usage
export { FigmaClient } from './core/figma-client.js';
export { TokenFilter } from './core/token-filter.js';
export { TokenExtractor } from './core/token-extractor.js';
export { AliasResolver } from './core/alias-resolver.js';
export { StyleDictionaryTransformer } from './transformers/style-dictionary.js';
export { DeveloperPackageBuilder } from './builders/developer-package.js';
export { loadConfig } from './config/loader.js';
