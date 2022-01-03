const path = require("path");
const project = require('../webpack/base.config.js');;

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-knobs/preset"
  ],
  webpackFinal: (config) => {
    config.resolve.alias["@assets"] = path.resolve(__dirname, "../assets")
    config.resolve.alias["@spec"] = path.resolve(__dirname, "../spec")
    config.resolve.alias["@src"] = path.resolve(__dirname, "../src")
    config.resolve.alias["@stories"] = path.resolve(__dirname, "../stories")
    config.resolve.alias["@vendor"] = path.resolve(__dirname, "../vendor")

    return {
      ...config,
      module: {
        ...config.module,
        rules: project.module.rules
      }
    };
  },
}