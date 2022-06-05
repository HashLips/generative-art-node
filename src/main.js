const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const {
  nft_project_name,
  description,
  baseUri,
  mainQuantity,
  format,
  fileType,
  races,
  rarityWeight,
} = require("./config.js");

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}
const buildDir = `${process.env.PWD}/build`;
const buildDir_json = `${buildDir}/json`;
const buildDir_png = `${buildDir}/png`;
const metDataFile = "_metadata.json";
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
const Exists = new Map();
//

function saveSingleNftMetadata(_edition) {
  const _singleMetadata = metadata.find((m) => m.edition == _edition);
  fs.writeFileSync(
    `${buildDir_json}/${_edition}.json`,
    JSON.stringify(_singleMetadata)
  );
}
// function createDna(_layers, _race, _raceIndex) {
//   let randDna = [{ layer }];
//   _layers.forEach((layer) => {
//     const rand = Math.random();
//     const _elementIndex = Math.floor(rand * rarityFolder.length);
//     randDna.push({ elementIndex: _elementIndex, rarity: getRarity() });
//   });
//   return;
// }

const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

const getRarityElements = (path, rarity) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((e, index) => {
      return {
        id: index + 1,
        name: cleanName(e),
        path: `${path}/${e}`,
        rarity,
      };
    });
};

const layersSetup = (race) => {
  const layersOrder = race.layersOrder;
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    rarityFolder: rarityWeight.map((e) =>
      getRarityElements(
        `${layersDir}/${race.name}/${layerObj.name}/${e.rarityType}`,
        e.rarityType
      )
    ),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
  }));

  return layers;
};

//Index.js call: First
//Create build folder to store the _metadata.json and the nfts
const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  //
  if (fs.existsSync(buildDir_png)) {
    fs.rmdirSync(buildDir_png, { recursive: true });
  }
  fs.mkdirSync(buildDir_png);
  //
  if (fs.existsSync(buildDir_json)) {
    fs.rmdirSync(buildDir_json, { recursive: true });
  }
  fs.mkdirSync(buildDir_json);
};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(
    `${buildDir_png}/${_edition}.png`,
    _canvas.toBuffer("image/png")
  );
};

const addMetadata = (_race, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    image: `${baseUri}/${_edition}.${fileType}`,
    name: `${nft_project_name} #${_edition}`,
    description: description,
    race: _race,
    attributes: attributes,
    date: dateTime,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
};

const addAttributes = (trait_type, _value) => {
  let tempAttr = {
    trait_type: trait_type.name,
    value: _value.name,
    rarity: _value.rarity,
  };
  attributes.push(tempAttr);
  hash.push(trait_type.id);
  hash.push(_value.id);
  decodedHash.push({ [trait_type.id]: _value.id });
};

function getRarity() {
  let index = 0;
  const weight = 100 * Math.random();
  for (let i = 0; i < rarityWeight.length; ++i) {
    // console.log(rarityWeight[i].weight + " " + weight);
    if (rarityWeight[i].weight >= weight) {
      index = i;
      break;
    }
  }
  return index;
}

const drawLayer = async (_layer, _edition) => {
  //here
  const rarityIndex = getRarity();
  // console.log("RARITY INDEX " + rarityIndex);
  const rarityFolder = _layer.rarityFolder[rarityIndex];
  //select file random Index
  const rand = Math.random();
  const fileRandIndex = Math.floor(rand * rarityFolder.length);
  const _file = rarityFolder[fileRandIndex];

  // console.log(`Selected Layer Element of rarity ${rarityIndex}`, _file);

  //Im here
  addAttributes(_layer, _file); //

  const image = await loadImage(_file.path); //location will be removed

  ctx.drawImage(
    image,
    _layer.position.x,
    _layer.position.y,
    _layer.size.width,
    _layer.size.height
  );
  saveLayer(canvas, _edition);
};

//Index.js call: Second
//Generator
const createFiles = async () => {
  races.forEach(async (_race) => {
    const _layers = layersSetup(_race);
    const _quantity = _race.quantity;
    let numDupes = 0;

    for (let i = 1; i <= _quantity; i++) {
      await _layers.forEach(async (layer) => {
        await drawLayer(layer, i);
      });

      let key = hash.toString();

      if (Exists.has(key)) {
        console.log(
          `Duplicate creation for edition ${i}. Same as edition ${Exists.get(
            key
          )}`
        );
        numDupes++;
        if (numDupes > _quantity) break; //prevents infinite loop if no more unique items can be created
        i--;
      } else {
        Exists.set(key, i);
        addMetadata(_race.name, i);
        saveSingleNftMetadata(i);
        console.log("Creating edition " + i);
      }
    }
  });
};

//Index.js call: Third
//Creates _metadata.json file and parses a string into a json.
const createMetaData = () => {
  fs.stat(`${buildDir}/${metDataFile}`, (err) => {
    if (err == null || err.code === "ENOENT") {
      fs.writeFileSync(
        `${buildDir}/${metDataFile}`,
        JSON.stringify(metadata, null, 2)
      );
    } else {
      console.log("Oh no, error: ", err.code);
    }
  });
};

module.exports = { buildSetup, createFiles, createMetaData };
