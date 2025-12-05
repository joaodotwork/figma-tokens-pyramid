/**
 * Figma API Client
 *
 * Handles communication with Figma's Variables API
 */

import fetch from 'node-fetch';

export class FigmaClient {
  constructor(config) {
    this.accessToken = config.accessToken || config.figmaToken;
    this.fileKey = config.fileKey;
    this.baseUrl = 'https://api.figma.com';
  }

  /**
   * Make a request to the Figma API
   * @param {string} endpoint - API endpoint (e.g., '/v1/files/:file_key/variables/local')
   * @param {object} options - Fetch options
   * @returns {Promise<object>} API response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'X-Figma-Token': this.accessToken,
          ...options.headers
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Figma API request failed: ${response.status} - ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (error) {
      if (error.message.includes('Figma API request failed')) {
        throw error;
      }
      throw new Error(`Figma API request failed: ${error.message}`);
    }
  }

  /**
   * Verify access to a Figma file
   * @returns {Promise<object>} File metadata
   */
  async verifyAccess() {
    return this.request(`/v1/files/${this.fileKey}`);
  }

  /**
   * Fetch all variables from a Figma file
   * @returns {Promise<object>} Variables response with meta.variables and meta.variableCollections
   */
  async fetchVariables() {
    return this.request(`/v1/files/${this.fileKey}/variables/local`);
  }

  /**
   * Fetch a specific variable collection
   * @param {string} collectionId - Variable collection ID
   * @returns {Promise<object>} Variable collection data
   */
  async fetchCollection(collectionId) {
    return this.request(`/v1/variables/${this.fileKey}/${collectionId}`);
  }

  /**
   * Fetch file metadata
   * @returns {Promise<object>} File data
   */
  async fetchFile() {
    return this.request(`/v1/files/${this.fileKey}`);
  }
}
