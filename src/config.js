const layersOrder = [
  { name: "background", number: 7 },
  { name: "body", number: 7 },
  { name: "eyes", number: 6 },
  { name: "mouth", number: 7 },
  { name: "tattoo", number: 7 },
];

const format = {
  width: 230,
  height: 230,
};

const rarity = [
  { key: "", val: "original" },
  { key: "_r", val: "rare" },
  { key: "_sr", val: "super rare" },
];

const defaultEdition = 5;

module.exports = { layersOrder, format, rarity, defaultEdition };
