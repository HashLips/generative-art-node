const basePath = process.cwd();
const sha1 = require(`sha1`);
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
  process.env.PWD = basePath;
}
const buildDir = `${process.env.PWD}/build`;
const buildDir_json = `${buildDir}/json`;
const buildDir_png = `${buildDir}/png`;
const metDataFile = "_metadata.json";
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
const Exists = new Map();
//

function saveSingleNftMetadata(_edition) {
  const _singleMetadata = metadata.find((m) => m.edition == _edition);
  fs.writeFileSync(
    `${buildDir_json}/${_edition}.json`,
    JSON.stringify(_singleMetadata)
  );
}

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

const addMetadata = (_edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: sha1(hash.join("")),
    edition: _edition,
    image: `${baseUri}/${_edition}.${fileType}`,
    name: `${nft_project_name} #${_edition}`,
    description: description,
    attributes: attributes,
    date: dateTime,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
};

const addAttributes = (trait_type, _value) => {
  let tempAttr = {};
  if (_value.rarity != undefined) {
    tempAttr = {
      trait_type: trait_type.name,
      value: _value.name,
      rarity: _value.rarity,
    };
  } else {
    tempAttr = {
      trait_type: trait_type.name,
      value: _value.name,
    };
  }

  attributes.push(tempAttr);
  hash.push(trait_type.id);
  if (_value.id != undefined) hash.push(_value.id);
};

function getRarityIndex() {
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
function getRaceIndex() {
  let index = 0;
  const weight = 100 * Math.random();
  for (let i = 0; i < races.length; ++i) {
    // console.log(rarityWeight[i].weight + " " + weight);
    if (races[i].quantity >= weight) {
      index = i;
      break;
    }
  }
  return index;
}

const drawLayer = async (_layer, _edition) => {
  //here
  const rarityIndex = getRarityIndex();
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
const generateFiles = () => {
  generateFilesSpecificRaceQuantity();
  return;
  if (mainQuantity == undefined || mainQuantity == 0) {
    generateFilesSpecificRaceQuantity();
  } else if (mainQuantity > 0) {
    generateFilesRandomRaceQuantity();
  }
};
async function generateFilesSpecificRaceQuantity() {
  races.forEach(async (_race, _raceIndex) => {
    const _layers = layersSetup(_race);
    const _quantity = _race.quantity;
    let numDupes = 0;

    for (let i = 1; i <= _quantity; i++) {
      //Add race to attributes if race.name is not undefined
      if (races.length > 1)
        addAttributes({ name: "race", id: _raceIndex }, { name: _race.name });
      //generate layers
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
        addMetadata(i);
        saveSingleNftMetadata(i);
        console.log("Creating edition " + i);
      }
    }
  });
}
async function generateFilesRandomRaceQuantity() {
  let numDupes = 0;
  for (let i = 0; i < mainQuantity; ++i) {
    //Get randomRace
    const _raceIndex = getRaceIndex();
    //Add race to attributes if race.name is not undefined
    if (races.length > 1)
      addAttributes(
        { name: "race", id: _raceIndex },
        { name: races[_raceIndex].name }
      );
    //generate layers
    const _layers = layersSetup(races[_raceIndex]);
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
      if (numDupes > mainQuantity) break; //prevents infinite loop if no more unique items can be created
      i--;
    } else {
      Exists.set(key, i);
      const newEdition = i + 1;
      addMetadata(newEdition);
      saveSingleNftMetadata(newEdition);
      console.log("Creating edition " + newEdition);
    }
  }
}

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

module.exports = { buildSetup, generateFiles, createMetaData };
