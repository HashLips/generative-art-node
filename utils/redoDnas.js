const basePath = process.cwd();
const fs = require("fs");
const { layerConfigurations } = require("../src/config.js");
//
const buildDir = `${basePath}/build`;
const dnaFile = `${buildDir}/new_dna.json`;
const metaDir = `${basePath}/build/json/`;
const layerDir = `${basePath}/layers`;

//Settings
const editionCount = 1000;
//Dont Touch
let LayerGroup = [];
let new_dnas = [];

function findRightName(attribute) {
  //
  const trait_type = attribute.trait_type;
  const attrValue = attribute.value;

  const AttrToSearchInto = LayerGroup.filter((e) => {
    return e.trait_type == trait_type;
  });
  if (AttrToSearchInto.length === 0)
    return `--No Attr found of type ${trait_type}--`;

  return AttrToSearchInto[0].elements.filter((e) => {
    if (e.includes(attrValue)) {
      const elementName = e.split(`#`)[0].split(`:`)[1];
      return elementName == attrValue;
    } else {
      return false;
    }
  });
}

function BuildDna(index) {
  const mata = JSON.parse(fs.readFileSync(`${metaDir}${index + 1}.json`));
  let new_dna = "";
  //
  const length = mata.attributes.length;
  const lastIndex = length - 1;
  for (let i = 0; i < length; i++) {
    const _file = findRightName(mata.attributes[i]);
    const _dnaPart =
      _file.length === 0
        ? `||||||${mata.attributes[i].value} was no found on ${mata.attributes[i].trait_type}||||||`
        : _file.length > 1
        ? `||||||More Than one element (${_file})||||||`
        : _file;
    if (i != lastIndex) new_dna += `${_dnaPart}` + "*";
    else new_dna += `${_dnaPart}`;
  }

  new_dnas.push(new_dna);
}
function writeFile() {
  console.log("END", new_dnas);
  fs.writeFileSync(dnaFile, JSON.stringify(new_dnas, null, 2));
}

function getAllLayerFiles(folder, indexing = "") {
  const files = fs.readdirSync(`${layerDir}/${folder}`);
  let elements = [];
  for (let j = 0; j < files.length; j++) {
    elements.push(`${indexing}.${j}:${files[j]}`);
  }
  LayerGroup.push({ trait_type: folder, length: elements.length, elements });
}

function Execute() {
  const _layers = layerConfigurations[0].layersOrder;
  console.log(_layers.length);
  for (let i = 0; i < _layers.length; i++) {
    getAllLayerFiles(_layers[i].name, `${i}`);
  }
  // console.log(LayerGroup);
  // console.log(`new_dnas count : ${LayerGroup.length}`);

  for (let i = 0; i < editionCount; ++i) {
    BuildDna(i);
  }
  writeFile();
}

Execute();
