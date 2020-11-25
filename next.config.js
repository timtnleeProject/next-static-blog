const path = require("path");
const fs = require("fs");

const vars = fs.readFileSync(path.join(__dirname, "./styles/vars.scss"), "utf-8");

module.exports = {
  sassOptions: {
    prependData: vars,
  },
};
