const nft_project_name = "MOMO";
const description = "This is a description";
const baseUri = "http://";
const quantity = 10;
const format = {
  width: 230,
  height: 230,
};

const layersOrder = [
  { name: "background" },
  { name: "body" },
  { name: "eyes" },
  { name: "mouth" },
  { name: "tattoo" },
];
const races = [
  {
    name: "momo",
    quantity: 10,
    layerOrder: [
      { name: "background" },
      { name: "body" },
      { name: "eyes" },
      { name: "mouth" },
      { name: "tattoo" },
    ],
  },
];
// rarity level start from 0 to -> 999.... mining 0 is the most rare
const rarityWeight = [
  { rarityType: "super-rare", weight: 5 },
  { rarityType: "rare", weight: 25 },
  { rarityType: "common", weight: 70 },
];

// const rases = [
//   { layerName: "male", quantity: 5000 },
//   { layerName: "female", quantity: 5000 },
//   { layerName: "female_red", quantity: 5000 },
// ];

module.exports = {
  nft_project_name,
  description,
  baseUri,
  quantity,
  format,
  layersOrder,
  races,
  rarityWeight,
};
