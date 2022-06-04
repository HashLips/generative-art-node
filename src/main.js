const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const {
  layersOrder,
  format,
  defaultEdition,
  rarityWeight,
} = require("./config.js");

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const buildDir = `${process.env.PWD}/build`;
const metDataFile = "_metadata.json";
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
const Exists = new Map();

const cleanName = (_str) => {
  let name = _str.slice(0, -4);

  return name;
};

const getElements = (path, rarity) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((e) => {
      return {
        // id: index + 1,
        name: cleanName(e),
        path: `${path}/${e}`, //fileName: i,
        rarity,
      };
    });
};

const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    // location: `${layersDir}/${layerObj.name}/`, //remove
    // elements: getElements(`${layersDir}/${layerObj.name}/`),
    elements: rarityWeight.map((e) =>
      getElements(`${layersDir}/${layerObj.name}/${e.rarityType}`, e.rarityType)
    ),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number,
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
};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(
    `${buildDir}/${_edition}.png`,
    _canvas.toBuffer("image/png")
  );
};

const addMetadata = (_edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    hash: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    date: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
};

const addAttributes = (_element, _layer, _id) => {
  let tempAttr = {
    id: _id,
    layer: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
};

function getRarity() {
  let index = 0;
  const weight = Math.random();
  for (let i = 0; i < rarityWeight.length; ++i) {
    if (rarityWeight[i].weight <= weight) {
      index = i;
      break;
    }
  }
  return index;
}

const drawLayer = async (_layer, _edition) => {
  //here
  const rand = Math.random();
  let element = _layer.elements[Math.floor(rand * _layer.number)]
    ? _layer.elements[Math.floor(rand * _layer.number)]
    : null;
  if (element) {
    const rarityIndex = getRarity();
    console.log("RARITY INDEX " + rarityIndex);
    const _element = _layer.elements[rarityIndex];
    addAttributes(_element, _layer, _edition);
    const image = await loadImage(`${_element.path}/${element.fileName}`); //location will be removed

    ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    saveLayer(canvas, _edition);
  }
};

//Index.js call: Second
//Generator
const createFiles = async () => {
  const layers = layersSetup(layersOrder);

  let numDupes = 0;
  for (let i = 1; i <= defaultEdition; i++) {
    await layers.forEach(async (layer) => {
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
      if (numDupes > defaultEdition) break; //prevents infinite loop if no more unique items can be created
      i--;
    } else {
      Exists.set(key, i);
      addMetadata(i);
      console.log("Creating edition " + i);
    }
  }
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
