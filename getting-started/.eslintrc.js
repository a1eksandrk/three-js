module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'rules': {
    'brace-style': [
      'error',
      '1tbs'
    ],
    'curly': [
      'error',
      'all'
    ],
    'indent': [
      'error',
      2
    ],
    'quotes': [
      'error',
      'single'
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'space-before-function-paren': [
      'error',
      {
        'anonymous': 'always',
        'asyncArrow': 'always',
        'named': 'never'
      }
    ],
    'semi': 'error',
    'arrow-parens': 'error',
    'no-trailing-spaces': 'error',
    'no-multi-spaces': 'error'
  }
};
