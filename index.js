const { buildSetup, createFiles, createMetaData } = require("./src/main.js");

(() => {
  buildSetup();
  createFiles();
  createMetaData();
})();
