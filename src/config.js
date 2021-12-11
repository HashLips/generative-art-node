// const layersOrder = [
//     { name: 'background', number: 1 },
//     { name: 'ball', number: 2 },
//     { name: 'eye color', number: 12 },
//     { name: 'iris', number: 3 },
//     { name: 'shine', number: 1 },
//     { name: 'shine', number: 1 },
//     { name: 'bottom lid', number: 3 },
//     { name: 'top lid', number: 3 },
// ];

const layersOrder = [
	{ name: "Background" },
	{ name: "Abdomen" },
	{ name: "Wings" },
	{ name: "LegLeft" },
	{ name: "Thorax" },
	{ name: "LegRight" },
	{ name: "EyeLeft" },
	{ name: "Mouth" },
	{ name: "EyeRight" },
	{ name: "Horn" },
];

const format = {
	width: 256,
	height: 256,
};

const rarity = [
	{ key: "", val: "common" },
	{ key: "_uc", val: "uncommon" },
	{ key: "_r", val: "rare" },
	{ key: "_ep", val: "epic" },
	{ key: "_lg", val: "legendary" },
	{ key: "_uq", val: "unique" },
];

const defaultEdition = 5;

module.exports = { layersOrder, format, rarity, defaultEdition };
