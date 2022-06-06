const { buildSetup, generateFiles, createMetaData } = require("./src/main.js");

(() => {
  buildSetup();
  generateFiles();
  createMetaData();
})();
