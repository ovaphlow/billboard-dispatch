module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'import/prefer-default-export': 0,
    'import/no-named-default': 0,
    'import/extensions': 0,
  },
};
