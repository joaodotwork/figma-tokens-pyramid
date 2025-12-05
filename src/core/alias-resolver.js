/**
 * Alias Resolver
 *
 * Resolves variable aliases (references) in tokens
 */

export class AliasResolver {
  /**
   * Resolve aliases in tokens
   * @param {object} tokens - Tokens with potential aliases
   * @param {object} allVariables - All variables from Figma for reference lookup
   * @returns {object} Tokens with resolved aliases
   */
  resolveAliases(tokens, allVariables) {
    const resolvedTokens = {};

    Object.entries(tokens).forEach(([collection, categories]) => {
      resolvedTokens[collection] = {};

      Object.entries(categories).forEach(([category, categoryTokens]) => {
        resolvedTokens[collection][category] = this.processTokenOrObject(
          categoryTokens,
          allVariables
        );
      });
    });

    return resolvedTokens;
  }

  /**
   * Process a token object or nested structure recursively
   * @param {*} obj - Token or object to process
   * @param {object} allVariables - All variables for lookup
   * @returns {*} Processed object
   */
  processTokenOrObject(obj, allVariables) {
    // If this is a token data object with a 'value' property
    if (obj && obj.value !== undefined && obj.type !== undefined) {
      const { value, type, id } = obj;

      // Check if it's an alias
      if (value && typeof value === 'object' && value.type === 'VARIABLE_ALIAS') {
        const aliasId = value.id;
        const referencedVar = allVariables[aliasId];

        if (referencedVar) {
          // It's a resolvable alias
          return {
            ...obj,
            aliasOf: referencedVar.name,
            aliasId
          };
        } else {
          // Can't resolve alias
          return {
            ...obj,
            unresolvedAlias: aliasId
          };
        }
      } else {
        // Not an alias, return as is
        return obj;
      }
    }
    // If this is a nested object (not a token), process each property
    else if (obj && typeof obj === 'object') {
      const result = {};

      Object.entries(obj).forEach(([key, value]) => {
        result[key] = this.processTokenOrObject(value, allVariables);
      });

      return result;
    }
    // For any other values, return as is
    else {
      return obj;
    }
  }

  /**
   * Clean tokens for output (remove internal metadata)
   * @param {object} tokens - Tokens to clean
   * @returns {object} Cleaned tokens
   */
  cleanTokensForOutput(tokens) {
    const cleanedTokens = {};

    Object.entries(tokens).forEach(([collection, categories]) => {
      cleanedTokens[collection] = {};

      Object.entries(categories).forEach(([category, categoryTokens]) => {
        cleanedTokens[collection][category] = this.cleanTokenOrObject(categoryTokens);
      });
    });

    return cleanedTokens;
  }

  /**
   * Clean a token or nested object
   * @param {*} obj - Token or object to clean
   * @returns {*} Cleaned object
   */
  cleanTokenOrObject(obj) {
    // If this is a token data object
    if (
      obj &&
      (obj.value !== undefined || obj.aliasOf !== undefined || obj.unresolvedAlias !== undefined)
    ) {
      // This is a resolvable alias
      if (obj.aliasOf) {
        return {
          value: obj.aliasOf, // Reference by name
          type: obj.type,
          isAlias: true
        };
      }
      // Unresolvable alias (kept for debugging)
      else if (obj.unresolvedAlias) {
        return {
          value: `Unresolved alias: ${obj.unresolvedAlias}`,
          type: obj.type,
          isAlias: true
        };
      }
      // Unprocessed alias
      else if (obj.value && typeof obj.value === 'object' && obj.value.type === 'VARIABLE_ALIAS') {
        return {
          value: `Alias reference: ${obj.value.id}`,
          type: obj.type,
          isAlias: true
        };
      }
      // Direct value
      else {
        return {
          value: obj.value,
          type: obj.type
        };
      }
    }
    // If this is a nested object (not a token), process each property
    else if (obj && typeof obj === 'object') {
      const result = {};

      Object.entries(obj).forEach(([key, value]) => {
        result[key] = this.cleanTokenOrObject(value);
      });

      return result;
    }
    // For any other values, return as is
    else {
      return obj;
    }
  }
}
