const nft_project_name = "MOMO";
const description = "This is a description";
const baseUri = "http://";
const mainQuantity = 0;
const format = {
  width: 230,
  height: 230,
};
const races = [
  {
    name: "momo",
    quantity: 10, //if mainQuantity is greater than 0 this "quantity" becomes a weight
    layersOrder: [
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
module.exports = {
  nft_project_name,
  description,
  baseUri,
  mainQuantity,
  format,
  races,
  rarityWeight,
};
