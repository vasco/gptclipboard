module.exports = function () {
  return {
    files: ["**/*.js"],

    tests: ["**/*.test.js"],

    env: {
      type: "node",
      runner: "node", // or full path to any node executable
    },
  };
};
