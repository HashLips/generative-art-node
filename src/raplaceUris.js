const basePath = process.cwd();
const fs = require("fs");
const { baseUri } = require("./config.js");
//
const buildDir = `${basePath}/build`;
const dnaFilePath = `${buildDir}/_DNAs.json`;

function replaceDnaFileUris() {
  //add uri to _DNAs.json and from there to metadatas
  let _dnas = JSON.parse(fs.readFileSync(dnaFilePath));

  const length = _dnas.length;
  for (let i = 0; i < length; ++i) {
    _dnas[i].image = `ipfs://${baseUri}/${i}.png`;
  }
  fs.writeFileSync(`${dnaFilePath}`, JSON.stringify(_dnas, null, 2));
}

module.exports = { replaceDnaFileUris };
