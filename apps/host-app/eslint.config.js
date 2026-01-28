const { ignores, configs } = require('@eduzz/eslint-config/react-native');

/** @type import('eslint').Linter.Config[] */
module.exports = [...configs, { ignores: ignores() }];
