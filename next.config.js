const path = require("path");
const fs = require("fs");
const transpile = require("next-transpile-modules");
const withPlugins = require("next-compose-plugins");

const vars = fs.readFileSync(path.join(__dirname, "./styles/vars.scss"), "utf-8");

module.exports = withPlugins(
  [transpile(["react-syntax-highlighter/dist/esm/styles/prism"])],
  {
    sassOptions: {
      prependData: vars,
    },
  },
);
