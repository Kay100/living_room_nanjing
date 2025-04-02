module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'standard',
    'eslint-config-airbnb-base',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    sourceType: 'module',
    babelOptions: {
      parserOpts: {
        plugins: ['jsx'],
      },
    },
  },
  plugins: ['vue'],
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    wx: true,
    uni: true,
    Component: true,
  },
  settings: {
    'import/parsers': {
      '@babel/eslint-parser': ['.js', '.jsx'],
    },
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-continue': 'off',
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'guard-for-in': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/first': 'off', // https://github.com/vuejs/vue-eslint-parser/issues/58
    'prettier/prettier': 'off',
    camelcase: 'off',
    'no-use-before-define': 'off',
    'vue/multi-word-component-names': 'off',
    'no-unused-expressions': 'off',
    'consistent-return': 'off',
  },
};
