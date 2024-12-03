module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1", // Ganti dengan path sesuai struktur proyek Anda
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Memastikan TypeScript di-compile dengan ts-jest
    },
};