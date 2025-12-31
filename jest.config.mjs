export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/"],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/$1",
    "^expo$": "<rootDir>/__mocks__/expo.ts",
    "^expo-router$": "<rootDir>/__mocks__/expo-router.ts",
    "^react-native$": "<rootDir>/__mocks__/react-native.ts",
  },
};
