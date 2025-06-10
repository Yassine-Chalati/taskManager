// jest.config.js
module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest', // You can use babel-jest for ES6 compatibility
    },
    testPathIgnorePatterns: ['/node_modules/', '/logs/'],
};
