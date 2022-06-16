const { generateDNAs } = require("./src/dna-generator.js");
const { generateEditionsMetaFiles } = require("./src/meta-generator.js");
const { generateImages } = require("./src/image-generator.js");
const { replaceDnaFileUris } = require("./src/raplaceUris.js");

(() => {
  //Step One
  // generateDNAs();
  //Step Two
  // generateImages();
  //Step Three
  // replaceDnaFileUris();
  //Step FOur
  generateEditionsMetaFiles();
})();
