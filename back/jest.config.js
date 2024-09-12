/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testMatch: [
    "**/src/**/*.spec.ts"
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node",
  preset: "ts-jest",
};