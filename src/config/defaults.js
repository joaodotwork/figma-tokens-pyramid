/**
 * Default Configuration
 *
 * Default values for package configuration
 */

export function getDefaultConfig() {
  return {
    figma: {
      fileKey: process.env.FIGMA_FILE_KEY,
      accessToken: process.env.FIGMA_ACCESS_TOKEN,
      collections: {},
      modes: {}
    },

    output: {
      directory: './tokens',
      formats: ['json']
    },

    platforms: ['web'],

    developerPackage: {
      enabled: false,
      output: './developer-packages',
      packageName: 'design-tokens',
      packageDescription: 'Design token system with {total} tokens',
      version: '1.0.0',
      autoVersion: {
        strategy: 'datestamp',
        dateFormat: 'YYYYMMDD',
        prefix: ''
      },
      archive: {
        enabled: true,
        format: 'zip',
        filename: '{date}-{name}-package.{ext}'
      },
      include: ['reference', 'system', 'component'],
      keywords: ['design-tokens', 'design-system'],
      author: '',
      license: 'MIT',
      exports: {
        autoGenerate: true,
        main: './reference/color.json'
      }
    },

    transform: {},

    validate: {
      strict: false,
      failOnMissingRefs: false
    }
  };
}
