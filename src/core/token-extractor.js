/**
 * Token Extractor
 *
 * Extracts and organizes tokens from Figma variables into hierarchical structure
 */

export class TokenExtractor {
  constructor(config) {
    this.collections = config.collections || {};
    this.modes = config.modes || {};
  }

  /**
   * Categorize a variable by its name
   * @param {string} name - Variable name (e.g., "typography/fontSize/md")
   * @returns {string} Category (e.g., "typography")
   */
  categorizeVariable(name) {
    const parts = name.split('/');
    return parts.length > 0 ? parts[0] : 'other';
  }

  /**
   * Create nested object structure from a path
   * @param {object} obj - Object to add to
   * @param {string} path - Path (e.g., "fontSize/md")
   * @param {*} value - Value to set
   * @returns {object} Modified object
   */
  createNestedStructure(obj, path, value) {
    const parts = path.split('/');
    let current = obj;

    // Navigate/create the nested structure except for the last part
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // Set the value at the final path segment
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;

    return obj;
  }

  /**
   * Extract tokens by collection
   * @param {object} variablesResponse - Filtered Figma API response
   * @returns {object} Tokens organized by collection
   */
  extractTokensByCollection(variablesResponse) {
    const variables = variablesResponse.meta?.variables || {};
    const collections = variablesResponse.meta?.variableCollections || {};

    // Get collection IDs from config or discover them
    const collectionIds = this.getCollectionIds(collections);

    // Initialize token objects
    const tokens = {
      reference: {},
      system: {},
      component: {}
    };

    // Process each variable
    Object.values(variables).forEach(variable => {
      const { name, variableCollectionId, valuesByMode, resolvedType } = variable;

      if (!name) return;

      // Determine which collection this belongs to
      let collectionKey = null;
      if (variableCollectionId === collectionIds.reference) {
        collectionKey = 'reference';
      } else if (variableCollectionId === collectionIds.system) {
        collectionKey = 'system';
      } else if (variableCollectionId === collectionIds.component) {
        collectionKey = 'component';
      }

      if (!collectionKey) return;

      // Get the appropriate mode ID
      const modeId = this.modes[collectionKey];
      if (!modeId || valuesByMode[modeId] === undefined) {
        console.warn(`⚠️  Skipping ${name}: Mode not found for ${collectionKey} collection`);
        return;
      }

      const value = valuesByMode[modeId];

      // Create token metadata
      const tokenData = {
        value: value,
        type: resolvedType,
        id: variable.id,
        originalVariable: variable
      };

      // Get category and create nested structure
      const category = this.categorizeVariable(name);

      // Initialize category if it doesn't exist
      if (!tokens[collectionKey][category]) {
        tokens[collectionKey][category] = {};
      }

      const nameParts = name.split('/');

      // If it's a nested path (2+ parts)
      if (nameParts.length > 1) {
        // Create a nested structure from the path (excluding first part which is category)
        const pathWithoutCategory = nameParts.slice(1).join('/');
        this.createNestedStructure(
          tokens[collectionKey][category],
          pathWithoutCategory,
          tokenData
        );
      } else {
        // Simple non-nested token
        const simpleName = nameParts[nameParts.length - 1];
        tokens[collectionKey][category][simpleName] = tokenData;
      }
    });

    return tokens;
  }

  /**
   * Get collection IDs from collections object
   * @param {object} collections - Variable collections
   * @returns {object} Collection IDs by key
   */
  getCollectionIds(collections) {
    // If explicitly configured, use those
    if (this.collections.reference && this.collections.system) {
      return {
        reference: this.collections.reference,
        system: this.collections.system,
        component: this.collections.component
      };
    }

    // Otherwise, discover from collections
    const ids = {};
    Object.entries(collections).forEach(([id, collection]) => {
      const name = collection.name.toLowerCase();
      if (name.includes('reference')) ids.reference = id;
      if (name.includes('system')) ids.system = id;
      if (name.includes('component')) ids.component = id;
    });

    return ids;
  }

  /**
   * Extract tokens (main method)
   * @param {object} variablesResponse - Figma API response
   * @returns {object} Extracted tokens
   */
  extract(variablesResponse) {
    return this.extractTokensByCollection(variablesResponse);
  }
}
