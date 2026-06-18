const js = require("@eslint/js");
const globals = require("globals");
const util = require("util");

if (typeof util.styleText !== "function") {
  const codes = {
    bold: [1, 22],
    dim: [2, 22],
    underline: [4, 24],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],
    grey: [90, 39],
  };
  util.styleText = function(format, text) {
    const formats = Array.isArray(format) ? format : [format];
    let result = text;
    for (const f of formats) {
      if (codes[f]) {
        result = `\x1b[${codes[f][0]}m${result}\x1b[${codes[f][1]}m`;
      }
    }
    return result;
  };
}

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
