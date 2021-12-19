const fs = require("fs");
// Layers of design
// Increase number value above real layer file count to create the option and porportions of empty render

const countLayerFiles = (layer) => fs.readdirSync(`./layers/${layer}`).length;

let layersOrder = [
  { name: "background" },
  { name: "ball" },
  { name: "eye color" },
  { name: "iris", drawRate: 0.4 },
  { name: "shine" },
  { name: "shine" },
  { name: "bottom lid" },
  { name: "top lid" },
];

// Dimensions of rendered images
const format = {
  width: 230,
  height: 230,
};

// Rarity - change val to control rarity group porportions
// name layer files with key at end
const rarity = [
  { key: "", val: 15 },
  { key: "_r", val: 8 },
  { key: "_sr", val: 2 },
];

const defaultEdition = 5;

// Automatic layer file count
module.exports = {
  layersOrder: layersOrder.map((layer) => ({
    ...layer,
    number: countLayerFiles(layer.name),
  })),
  format,
  rarity,
  defaultEdition,
};
