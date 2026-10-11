import angular from 'angular-eslint';

export default [
  { ignores: ['www/**', 'node_modules/**', '.angular/**'] },
  ...angular.configs.tsRecommended.map(config => ({ ...config, files: ['src/**/*.ts'] })),
  {
    files: ['src/**/*.ts'],
    processor: angular.processInlineTemplates,
    rules: {
      // Ionic router outlets retain page instances; preserve Angular's migrated strategy.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Page', 'Component'] }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
    },
  },
  ...angular.configs.templateRecommended.map(config => ({ ...config, files: ['src/**/*.html'] })),
];
