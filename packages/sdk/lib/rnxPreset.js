/**
 * Creates a final dependency preset to be used
 * in the host/mini-apps by doing the following:
 * - adds depenendencies from dependencies.json and devDependencies.json
 * - adds the SDK as a dev dependency
 * - adds the `mfe-app` as a capability
 *
 * We use `rnx-kit/align-deps` to align the dependencies.
 * Learn more about it here: https://microsoft.github.io/rnx-kit/docs/guides/dependency-management
 *
 */
const addSdkCapabilities = (dependencies, devDependencies) => {
  const path = require("path");
  // Assuming this file is in lib/, we go one level up to check package.json
  const sdkPackagePath = path.resolve(__dirname, "..", "package.json");
  const sdkPackageJson = require(sdkPackagePath);

  const allDeps = { ...dependencies, ...devDependencies };
  const profile = {};

  // Inject 'name' property if missing, ensuring rnx-kit accepts it as a capability
  Object.keys(allDeps).forEach((key) => {
    const isDev = !!devDependencies[key];
    profile[key] = {
      name: key,
      ...allDeps[key],
      devOnly: isDev,
    };
  });

  // profile["mfe-poc-sdk"] = {
  //   name: "mfe-poc-sdk",
  //   version: "workspace:*",
  //   devOnly: true,
  // };

  return Object.assign(profile, {
    "mfe-app": {
      name: "#meta",
      capabilities: Object.keys(profile),
    },
  });
};

module.exports = {
  main: addSdkCapabilities(
    require("../dependencies.json"),
    require("../devDependencies.json")
  ),
};
