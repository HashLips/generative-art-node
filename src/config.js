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

// const baseLayers = [
//   { layerName: "male", quantity: 5000 },
//   { layerName: "female", quantity: 5000 },
//   { layerName: "female_red", quantity: 5000 },
// ];

// rarity level start from 0 to -> 999.... mining 0 is the most rare
const rarityWeight = [
  { rarityType: "super-rare", weight: 5 },
  { rarityType: "rare", weight: 25 },
  { rarityType: "common", weight: 70 },
];

const quantity = 100;
const baseUri = "http://";
const description = "This is a description";

module.exports = {
  layersOrder,
  format,
  rarityWeight,
  quantity,
  baseUri,
  description,
};
