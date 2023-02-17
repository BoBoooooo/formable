module.exports = {
    clearMocks: true,
    coverageDirectory: "coverage",
    // moduleNameMapper: {
    //     "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
    //   "<rootDir>/tests/assetsTransformer.js",
    //     "\\.(css|less)$": "<rootDir>/tests/assetsTransformer.js",
    // },
    preset: "ts-jest",
    // setupFilesAfterEnv: ["./tests/setupTests.js"],
    snapshotSerializers: [require.resolve("enzyme-to-json/serializer")],
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
    transform: {
        "^.+\\.(js|jsx)?$": "babel-jest",
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
        "node_modules/(?!variables/.*)",
    ],
};
