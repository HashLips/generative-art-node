const { generateDNAs } = require("./src/dna-generator.js");
const { generateEditionsMetaFiles } = require("./src/meta-generator.js");
const { generateImages } = require("./src/image-generator.js");
const { replaceUris } = require("./src/replaceUris.js");

(() => {
  //Step One
  // generateDNAs();
  //Step Two
  // generateEditionsMetaFiles();
  //Step Three
  generateImages();
  //Step FOur
  //replaceUris();
})();
