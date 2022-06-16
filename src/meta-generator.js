const basePath = process.cwd();
const fs = require("fs");
const {
  baseUri,
  fileType,
  projectName,
  projectDescription,
  author,
} = require("./config.js");
//
const buildDir = `${basePath}/build`;
const buildDir_json = `${buildDir}/json`;
const dnasFile = `${buildDir}/_DNAs.json`;

function buildSetup() {
  if (fs.existsSync(buildDir_json)) return;
  fs.mkdirSync(buildDir_json);
}
function saveSingleNftMetadata(_dnas, _index) {
  const _dna = _dnas[_index];
  const _edition = _index + 1;
  const _singleMetadata = {
    dna: _dna.hash,

    name: `${projectName} #${_edition}`,
    description: projectDescription,
    image: _dna.image,
    edition: _edition,
    attributes: _dna.attributes.map((e) => {
      return { trait_type: e.trait_type, value: e.value };
    }),
    author,
  };
  //
  fs.writeFileSync(
    `${buildDir_json}/${_edition}.json`,
    JSON.stringify(_singleMetadata, null, 2)
  );
}

function generateEditionsMetaFiles() {
  const _dnas = JSON.parse(fs.readFileSync(dnasFile));
  console.log(_dnas.length);

  buildSetup();
  for (let i = 0; i < _dnas.length; ++i) {
    saveSingleNftMetadata(_dnas, i);
  }
}

module.exports = { generateEditionsMetaFiles };
