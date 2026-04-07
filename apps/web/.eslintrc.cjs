module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "../../.eslintrc.cjs"],
  rules: {
    "@next/next/no-html-link-for-pages": ["error", "app"],
  },
};
