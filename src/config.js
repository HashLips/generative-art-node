const fs = require("fs");

const width = 1000;
const height = 1000;
const layersDir = `${__dirname}/layers`;
const rarity = [
  { key: "", val: "original" },
  { key: "_r", val: "rare" },
  { key: "_sr", val: "super rare" },
];

const addRarity = (_str) => {
  let itemRarity;
  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });
  return itemRarity;
};

const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });
};

const layersOrder = [
  'background',
  'ball',
  'eye color',
  'iris',
  'shine',
  'shine',
  'bottom lid',
  'top lid'
];

const layers = layersOrder.map((layer, index) => ({
  id: index,
  name: layer,
  location: `${layersDir}/${layer}/`,
  elements: getElements(`${layersDir}/${layer}/`),
  position: { x: 0, y: 0 },
  size: { width: width, height: height },
}))

module.exports = { layers, width, height };
