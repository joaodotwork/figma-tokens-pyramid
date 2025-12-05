/**
 * Figma Tokens Pyramid Configuration
 *
 * This file configures how tokens are extracted from Figma,
 * transformed, and built for different platforms.
 */

export default {
  /**
   * Figma API Configuration
   */
  figma: {
    // Get from Figma file URL: figma.com/file/FILE_KEY/...
    fileKey: process.env.FIGMA_FILE_KEY,

    // Generate at: Figma → Account Settings → Personal Access Tokens
    accessToken: process.env.FIGMA_ACCESS_TOKEN,

    /**
     * Variable Collection IDs
     * Find these by inspecting Figma API responses
     */
    collections: {
      reference: 'VariableCollectionId:xxx:xxx',
      system: 'VariableCollectionId:xxx:xxx',
      component: 'VariableCollectionId:xxx:xxx'
    },

    /**
     * Mode IDs for each collection
     * Determines which variant of variables to extract (e.g., 'HB25', 'Light', 'Dark')
     */
    modes: {
      reference: 'modeId:xxx',
      system: 'modeId:xxx',
      component: 'modeId:xxx'
    }
  },

  /**
   * Output Configuration
   */
  output: {
    // Where to write token files
    directory: './tokens',

    // Output formats to generate
    formats: ['json', 'js', 'css', 'scss']
  },

  /**
   * Platform Builders
   * Which platforms to build tokens for
   */
  platforms: ['web', 'react-native'],

  /**
   * Developer Package Configuration
   * Auto-generate distributable token packages
   */
  developerPackage: {
    // Enable developer package generation
    enabled: true,

    // Output directory for packages
    output: './developer-packages',

    // Package name in package.json
    packageName: 'design-tokens',

    // Package description
    packageDescription: 'Design token system with {total} tokens',

    // Package version
    version: '1.0.0',

    /**
     * Automatic Versioning Strategy
     */
    autoVersion: {
      // Strategy: 'datestamp', 'semver', 'git-tag', 'custom'
      strategy: 'datestamp',

      // Date format for datestamp strategy
      dateFormat: 'YYYYMMDD',

      // Version prefix
      prefix: ''
    },

    /**
     * Archive Settings
     */
    archive: {
      enabled: true,
      format: 'zip', // 'zip' | 'tar.gz' | 'tar.bz2'
      filename: '{date}-{name}-package.{ext}'
    },

    /**
     * Which collections to include
     */
    include: ['reference', 'system', 'component'],

    /**
     * Package.json Fields
     */
    keywords: [
      'design-tokens',
      'design-system',
      'tokens',
      'figma'
    ],
    author: 'Your Team',
    license: 'MIT',

    /**
     * Custom Hooks (optional)
     * Run custom code before/after package creation
     */
    hooks: {
      // beforePackage: async (context) => {
      //   // Run before package creation
      // },
      // afterPackage: async (context, result) => {
      //   // Run after package creation
      //   // e.g., upload to S3, create GitHub release
      // }
    }
  },

  /**
   * Transformation Options
   */
  transform: {
    // Custom token transformations
    // transforms: []
  },

  /**
   * Validation Options
   */
  validate: {
    // Enable strict validation
    strict: false,

    // Fail on missing references
    failOnMissingRefs: false
  }
};
