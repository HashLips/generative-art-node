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
  
const format = {
    width: 1000,
    height: 1000
};

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const defaultEditions = 5;

module.exports = { layersOrder, format, rarity, defaultEditions };