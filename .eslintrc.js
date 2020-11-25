module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:react/recommended", "standard", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    quotes: [2, "double"],
    "comma-dangle": [2, "always-multiline"],
    semi: [2, "always"],
    "react/react-in-jsx-scope": 0,
    "react/prop-types": 0,
  },
};
