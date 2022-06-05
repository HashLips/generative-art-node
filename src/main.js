const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const {
  nft_project_name,
  description,
  baseUri,
  mainQuantity,
  format,
  races,
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
    .map((e, index) => {
      return {
        id: index + 1,
        name: cleanName(e),
        path: `${path}/${e}`, //fileName: i,
        rarity,
      };
    });
};

const layersSetup = (race) => {
  const layersOrder = race.layersOrder;
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    // location: `${layersDir}/${layerObj.name}/`, //remove
    // elements: getElements(`${layersDir}/${layerObj.name}/`),
    elements: rarityWeight.map((e) =>
      getElements(
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
};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(
    `${buildDir}/${_edition}.png`,
    _canvas.toBuffer("image/png")
  );
};

const addMetadata = (_race, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    dna: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    image: `${baseUri}/${_edition}`,
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

const addAttributes = (_element, _layer, _edition) => {
  let tempAttr = {
    id: _edition,
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
  const _rarityCategory = _layer.elements[rarityIndex];
  //select file random Index
  const rand = Math.random();
  const fileRandIndex = Math.floor(rand * _rarityCategory.length);
  const _file = _rarityCategory[fileRandIndex];

  // console.log(`Selected Layer Element of rarity ${rarityIndex}`, _file);

  //Im here
  addAttributes(_file, _layer, _edition); //

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
  for (let i = 0; i < races.length; i++) {
    const _race = races[i];

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
        console.log("Creating edition " + i);
      }
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
