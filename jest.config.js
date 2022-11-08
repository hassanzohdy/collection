module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  transform: {
    "\\.js$": "jest-esm-jsx-transform",
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^tests/(.*)$": "<rootDir>/tests/$1",
  },
};
