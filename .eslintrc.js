module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["plugin:react/recommended", "airbnb", "plugin:storybook/recommended"],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    "import/no-unresolved": 'off',
    "import/extensions": 'off',
    "react/jsx-filename-extension": 'off',
    "import/no-extraneous-dependencies": 'off',
    "no-undef": 'off',
    "import/prefer-default-export": 'off'
  }
};