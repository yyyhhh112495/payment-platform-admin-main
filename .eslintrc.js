module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'prefer-const': 0,
    'no-new': 0,
    'no-unneeded-ternary': 0
  },
  globals: {
    moment: true
  }
}
