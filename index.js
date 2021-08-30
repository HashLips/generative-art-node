const myArgs = process.argv.slice(2);
const { buildSetup, createFiles, createMetaData } = require("./src/main.js");
const { defaultEdition } = require("./src/config.js");
const edition = myArgs.length > 0 ? Number(myArgs[0]) : defaultEdition;

(() => {
  buildSetup();
  createFiles(edition);
  createMetaData();
})();

