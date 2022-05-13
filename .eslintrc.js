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
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn'
  }
}
