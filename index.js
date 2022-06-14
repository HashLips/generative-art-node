const { buildSetup, generateFiles, createMetaData } = require("./src/main.js");
const { generateNFTs } = require("./src/dna-generator.js");
const { generateEditionsMetaFiles } = require("./src/meta-generator.js");

(() => {
  // buildSetup();
  // generateFiles();
  // createMetaData();
  //
  // generateNFTs();
  generateEditionsMetaFiles();
})();
