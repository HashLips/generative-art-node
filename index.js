const { buildSetup, generateFiles, createMetaData } = require("./src/main.js");
const { generateDNAs } = require("./src/dna-generator.js");
const { generateEditionsMetaFiles } = require("./src/meta-generator.js");

(() => {
  // buildSetup();
  // generateFiles();
  // createMetaData();
  //
  // generateDNAs();
  generateEditionsMetaFiles();
})();
