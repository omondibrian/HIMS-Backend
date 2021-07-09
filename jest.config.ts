export default {
  roots: ["<rootDir>/__tests__"],
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules", "/dist"],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    "@Routes(.*)$": "<rootDir>/src/routes/$1",
    "@Services(.*)$": "<rootDir>/src/services/$1",
    "@Repositories(.*)$": "<rootDir>/src/Repositories/$1",
    "@Entities(.*)$": "<rootDir>/src/entities/$1",
    "@HIHM(.*)$": "<rootDir>/$1",
  },
};
