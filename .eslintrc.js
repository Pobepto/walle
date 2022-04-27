module.exports = {
  env: {
    es2021: true,
    node: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  globals: {
    JSX: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {}
}
