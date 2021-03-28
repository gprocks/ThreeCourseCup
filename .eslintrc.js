module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'multiline-ternary': 'off',
    'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', { allow: ['error'] }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-prototype-builtins': 'off',
    'no-tabs': 'off',
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'off',
    'vue/attribute-hyphenation': ['error', 'always'],
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      registeredComponentsOnly: true
    }],
    'vue/no-mutating-props': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
