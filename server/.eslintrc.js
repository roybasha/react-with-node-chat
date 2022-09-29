module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-undef': 'off',
    'no-case-declarations': 'off',
    'padded-blocks': 'off',
    'new-cap': 'off',
    indent: [
      'error',
      2
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ]
  }
};
