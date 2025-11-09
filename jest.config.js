const { createDefaultPreset, pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json'); // replace with the path to your tsconfig.json file

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
