/**
 * Style Dictionary Transformer
 *
 * Transforms tokens from pyramid structure to Style Dictionary format
 */

export class StyleDictionaryTransformer {
  /**
   * Transform tokens to Style Dictionary format
   * @param {object} tokens - Tokens in pyramid structure
   * @returns {object} Tokens in Style Dictionary format
   */
  transform(tokens) {
    const result = {
      reference: {},
      system: {
        typography: {}
      }
    };

    // Process reference tokens
    if (tokens.reference) {
      result.reference = this.transformReferenceTokens(tokens.reference);
    }

    // Process system tokens
    if (tokens.system) {
      result.system = this.transformSystemTokens(tokens.system);
    }

    // Process component tokens
    if (tokens.component) {
      result.component = this.transformComponentTokens(tokens.component);
    }

    return result;
  }

  /**
   * Transform reference tokens
   * @param {object} referenceTokens - Reference tokens
   * @returns {object} Transformed reference tokens
   */
  transformReferenceTokens(referenceTokens) {
    const transformed = {};

    Object.entries(referenceTokens).forEach(([category, categoryTokens]) => {
      transformed[category] = {};

      // Handle different category types
      if (category === 'typography') {
        transformed[category] = this.transformTypographyCategory(categoryTokens);
      } else if (category === 'dimension' || category === 'space' || category === 'radius') {
        transformed[category] = this.transformDimensionCategory(categoryTokens);
      } else {
        // Generic transformation
        transformed[category] = this.transformCategory(categoryTokens);
      }
    });

    return transformed;
  }

  /**
   * Transform system tokens
   * @param {object} systemTokens - System tokens
   * @returns {object} Transformed system tokens
   */
  transformSystemTokens(systemTokens) {
    const transformed = {};

    Object.entries(systemTokens).forEach(([category, categoryTokens]) => {
      if (category === 'typography') {
        // System typography has special nested structure (headline/xs/fontFamily)
        transformed[category] = this.transformSystemTypography(categoryTokens);
      } else {
        transformed[category] = this.transformCategory(categoryTokens);
      }
    });

    return transformed;
  }

  /**
   * Transform component tokens
   * @param {object} componentTokens - Component tokens
   * @returns {object} Transformed component tokens
   */
  transformComponentTokens(componentTokens) {
    const transformed = {};

    Object.entries(componentTokens).forEach(([component, componentValues]) => {
      transformed[component] = this.transformCategory(componentValues);
    });

    return transformed;
  }

  /**
   * Transform typography category (reference level)
   * @param {object} tokens - Typography tokens
   * @returns {object} Transformed tokens
   */
  transformTypographyCategory(tokens) {
    const transformed = {};

    Object.entries(tokens).forEach(([subcategory, values]) => {
      transformed[subcategory] = {};

      Object.entries(values).forEach(([key, token]) => {
        let value = token.value;
        if (token.isAlias) {
          value = `{${token.value}}`;
        }

        transformed[subcategory][key] = {
          value: value,
          type: token.type?.toLowerCase() || 'string',
          attributes: { category: 'typography' }
        };
      });
    });

    return transformed;
  }

  /**
   * Transform dimension-based category
   * @param {object} tokens - Dimension tokens
   * @returns {object} Transformed tokens
   */
  transformDimensionCategory(tokens) {
    const transformed = {};

    Object.entries(tokens).forEach(([key, token]) => {
      let value = token.value;
      if (token.isAlias) {
        value = `{${token.value}}`;
      }

      transformed[key] = {
        value: value,
        type: token.type?.toLowerCase() || 'float',
        attributes: { category: 'size' }
      };
    });

    return transformed;
  }

  /**
   * Transform system typography (with variants)
   * @param {object} tokens - System typography tokens
   * @returns {object} Transformed tokens
   */
  transformSystemTypography(tokens) {
    const transformed = {};

    // For each typography group (headline, content, etc.)
    Object.entries(tokens).forEach(([group, variants]) => {
      transformed[group] = {};

      // For each variant (xs, sm, md, etc.)
      Object.entries(variants).forEach(([variant, properties]) => {
        transformed[group][variant] = {};

        // For each property (fontFamily, fontSize, etc.)
        Object.entries(properties).forEach(([prop, token]) => {
          let value = token.value;
          if (token.isAlias) {
            value = `{${token.value}}`;
          }

          transformed[group][variant][prop] = {
            value: value,
            type: token.type?.toLowerCase() || 'string',
            attributes: { category: 'typography' }
          };
        });
      });
    });

    return transformed;
  }

  /**
   * Transform a generic category
   * @param {object} tokens - Category tokens
   * @returns {object} Transformed tokens
   */
  transformCategory(tokens) {
    const transformed = {};

    Object.entries(tokens).forEach(([key, value]) => {
      // If this is a nested object (not a token), recurse
      if (value && typeof value === 'object' && !value.value && !value.type) {
        transformed[key] = this.transformCategory(value);
      } else {
        // This is a token
        let tokenValue = value.value;
        if (value.isAlias) {
          tokenValue = `{${value.value}}`;
        }

        transformed[key] = {
          value: tokenValue,
          type: value.type?.toLowerCase() || 'string',
          attributes: { category: 'other' }
        };
      }
    });

    return transformed;
  }
}
