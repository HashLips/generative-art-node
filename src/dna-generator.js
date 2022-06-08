const basePath = process.cwd();
const sha1 = require(`sha1`);
const fs = require("fs");
const { mainQuantity, races, rarityWeight } = require("./config.js");
//
const buildDir = `${basePath}/build`;
const metDataFile = `${buildDir}/_DNAs.json`;
const layersDir = `${basePath}/layers`;
//
const Exists = new Map();
let paths = [];
let schemas = [];
//

function getRarity() {
  let index = rarityWeight.length - 1;
  let weight = 100 * Math.random();
  for (let i = 0; i < rarityWeight.length; ++i) {
    // console.log(rarityWeight[i].weight + " " + weight);
    if (rarityWeight[i].weight >= weight) {
      index = i;
      break;
    } else weight -= rarityWeight[i].weight;
  }
  return index;
}
function getRaceIndex() {
  let index = races.length - 1;
  let weight = 100 * Math.random();
  for (let i = 0; i < races.length; ++i) {
    // console.log(rarityWeight[i].weight + " " + weight);
    if (races[i].quantity >= weight) {
      index = i;
      break;
    } else weight -= races[i].quantity;
  }
  console.log("selected race " + (index == 0 ? "mama " : "momo "));

  return index;
}

function genDNA(_raceIndex) {
  // console.log(races[_raceIndex].layersOrder);
  const _layerOrder = races[_raceIndex].layersOrder;
  let attributes = [];

  if (races.length > 1) {
    attributes.push({ trait_type: "race", value: races[_raceIndex].name });
    console.log("add race");
  }

  for (let i = 0; i < _layerOrder.length; ++i) {
    const _rarityIndex = getRarity();
    const rand = Math.random();
    const fileRandIndex = Math.floor(
      rand *
        paths[_raceIndex].attributes[i].rarities[_rarityIndex].elements.length
    );
    attributes.push(
      paths[_raceIndex].attributes[i].rarities[_rarityIndex].elements[
        fileRandIndex
      ]
    );
  }
  const _hash = sha1(attributes.join(""));

  // schemas.push({ hash: _hash, attributes });
  return { hash: _hash, attributes };
}

//#region Setup
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};
function getRarityElements(path) {
  const paths = fs.readdirSync(path);
  const filteredPaths = paths
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((e) => {
      return {
        name: cleanName(e),
        path: `${path}/${e}`,
      };
    });
  return filteredPaths;
}
function getRaritiesWithTheirElements(_info) {
  let _rarities = [];

  //Rarity Loop
  for (const _rarity of rarityWeight) {
    const _path = `${layersDir}/${_info.raceName}/${_info.attributeName}/${_rarity.rarityType}`;
    const elements = getRarityElements(_path);

    _rarities.push({ rarityType: _rarity.rarityType, elements: elements });
  }
  return _rarities;
}
function setupPaths() {
  //Indexes
  //Race Loop
  for (let i = 0; i < races.length; ++i) {
    const _layerOrder = races[i].layersOrder;

    paths.push({ raceName: races[i].name, attributes: [] });
    //Layer Loop
    for (const _layer of _layerOrder) {
      paths[i].attributes.push({
        attributeName: _layer.name,
        rarities: getRaritiesWithTheirElements({
          raceName: races[i].name,
          attributeName: _layer.name,
        }),
      });
    }
  }
}
//#endregion

function generateNFTs() {
  //
  setupPaths();
  // console.log("Hey", paths[1].attributes[0].rarities[2].elements); //[0].attributes[0].rarities[2].elements

  let count = 0;
  let duplicateFoundCount = 0;
  for (let _raceIndex = 0; _raceIndex < races.length; ++_raceIndex) {
    console.log(races[_raceIndex].name);
    for (let i = 0; i < mainQuantity; i++) {
      const _dna = genDNA(_raceIndex);

      if (Exists.has(_dna.hash)) {
        console.log(
          races[_raceIndex].name +
            " " +
            i +
            " " +
            _dna.hash +
            " WAS A DUPLICATE"
        );
        --i;
        ++duplicateFoundCount;
      } //
      else {
        console.log(races[_raceIndex].name, _dna);
        Exists.set(_dna.hash, i);
        ++count;
      }
      //Generate DNA
    }
  }
  //DONE GENERATING DNA
  console.log(
    `NFT count: ${count}, duplicate found count: ${duplicateFoundCount}`
  );
}

module.exports = { generateNFTs };
