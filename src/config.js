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

const rarityWeight = [
  { rarityType: "super-rare", weight: 5 },
  { rarityType: "rare", weight: 25 },
  { rarityType: "common", weight: 70 },
];

const defaultEdition = 10;

module.exports = { layersOrder, format, rarityWeight, defaultEdition };
