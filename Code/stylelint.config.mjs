export default {
  extends: ['stylelint-config-standard-scss'],
  ignoreFiles: ['dist/**', 'node_modules/**'],
  rules: {
    'color-hex-length': 'short',
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9-]*$',
  },
};
