/**
 * Token Filter
 *
 * Filters Figma variables to specific collections and excludes deleted variables
 */

export class TokenFilter {
  constructor(config) {
    this.collections = config.collections || {};
    this.targetCollectionNames = ['Reference Tokens', 'System Tokens', 'Component Tokens'];
  }

  /**
   * Filter variables response to only include target collections
   * and exclude deleted variables
   * @param {object} variablesResponse - Raw Figma API response
   * @returns {object} Filtered variables response
   */
  filterVariables(variablesResponse) {
    const { variableCollections, variables: variablesMap } = variablesResponse.meta || {};

    if (!variableCollections || !variablesMap) {
      throw new Error('Invalid variables response format');
    }

    // Filter collections by name
    const filteredCollections = {};
    Object.entries(variableCollections).forEach(([collectionId, collection]) => {
      if (this.targetCollectionNames.includes(collection.name)) {
        filteredCollections[collectionId] = collection;
      }
    });

    // Filter variables to only those in target collections and exclude deleted ones
    const filteredVariables = {};
    Object.entries(variablesMap).forEach(([varId, variable]) => {
      const isInTargetCollection = Object.keys(filteredCollections).includes(
        variable.variableCollectionId
      );
      const isNotDeleted = !variable.deletedButReferenced;

      if (isInTargetCollection && isNotDeleted) {
        filteredVariables[varId] = variable;
      }
    });

    // Return filtered response
    return {
      ...variablesResponse,
      meta: {
        ...variablesResponse.meta,
        variableCollections: filteredCollections,
        variables: filteredVariables
      }
    };
  }

  /**
   * Get collection IDs by name
   * @param {object} variablesResponse - Figma API response
   * @returns {object} Map of collection names to IDs
   */
  getCollectionIds(variablesResponse) {
    const { variableCollections } = variablesResponse.meta || {};
    const collectionIds = {};

    Object.entries(variableCollections || {}).forEach(([id, collection]) => {
      if (this.targetCollectionNames.includes(collection.name)) {
        // Convert name to key: "Reference Tokens" -> "reference"
        const key = collection.name.split(' ')[0].toLowerCase();
        collectionIds[key] = id;
      }
    });

    return collectionIds;
  }

  /**
   * Get mode IDs for each collection
   * @param {object} variablesResponse - Figma API response
   * @returns {object} Map of collection keys to mode IDs
   */
  getModeIds(variablesResponse) {
    const { variableCollections } = variablesResponse.meta || {};
    const modeIds = {};

    Object.entries(variableCollections || {}).forEach(([id, collection]) => {
      if (this.targetCollectionNames.includes(collection.name)) {
        const key = collection.name.split(' ')[0].toLowerCase();
        // Get first mode ID (or HB25 mode if specified)
        const firstMode = collection.modes?.[0];
        if (firstMode) {
          modeIds[key] = firstMode.modeId;
        }
      }
    });

    return modeIds;
  }
}
