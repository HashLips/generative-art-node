const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { layersOrder, format, rarity } = require("./config.js");

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

const layersSetup = (layersOrder) => {
	/**
	 * --- DYNAMIC FOLDER STRUCTURE
	 * Now you can add multiple 'Style[i]' folders and various 'Pattern[j]'
	 * This lets you add patterns/details on top of a predetermined form(style)
	 * Example: A cat in Pose A wears a cape, while a spider in Pose B wears boots on each leg.
	 * 8 boots do not map well to a cat, but now you can have multiple spiders that will map to the boot accordingly
	 * AND a variety of cats that map well to the same assets
	 */
	const layers = [];
	let extraIndex = 0;

	layersOrder.map((layerObj, index) => {
		// primary asset folder and asset count
		let path = `${layersDir}/${layerObj.name}/`;
		let count = getElements(path).length;

		// determine if asset has different styles
		const hasDiffStyles = getElements(path).find((a) =>
			a.fileName.includes("Style")
		);

		// if it has different styles:
		if (hasDiffStyles) {
			// find how many different styles
			// pick a random style to build upon
			// operate within the style's directory
			const maxStyles = count;
			let style = Math.floor(Math.random() * maxStyles) + 1;
			path += `Style${style}/`;
			count = getElements(path).length;

			// check to see if a given style has various patterns
			const hasDiffPatterns = getElements(path).find((s) =>
				s.fileName.includes("Patterns")
			);
			// if it has various patterns, return style, then pattern.
			// else just return style
			if (hasDiffPatterns) {
				// if it has different patterns:

				// find how many different patterns
				// pick a random pattern
				// operate within the pattern's directory
				const maxPatterns = getElements(`${path}Patterns/`).length;
				const pattern = Math.floor(Math.random() * maxPatterns) + 1;

				// to find how many styles are available, subtract the number of Patterns in the accompanying folder
				const numPatterns = getElements(`${path}`).filter((f) =>
					f.fileName.includes("Pattern")
				).length;
				count -= numPatterns;

				// return pattern and style
				layers.push({
					id: index + extraIndex,
					name: `${layerObj.name}_${style}`,
					location: path,
					elements: getElements(path),
					position: { x: 0, y: 0 },
					size: { width: format.width, height: format.height },
					number: count,
				});

				extraIndex++;
				path += `Patterns/Pattern${pattern}/`;
				count = getElements(path).length;

				layers.push({
					id: index + extraIndex,
					name: `${layerObj.name}_${style}_${pattern}`,
					location: path,
					elements: getElements(path),
					position: { x: 0, y: 0 },
					size: { width: format.width, height: format.height },
					number: count,
				});
			} else {
				// if it does not have different patterns:

				// return the style in the current folder
				layers.push({
					id: index + extraIndex,
					name: `${layerObj.name}_${style}`,
					location: path,
					elements: getElements(path),
					position: { x: 0, y: 0 },
					size: { width: format.width, height: format.height },
					number: count,
				});
			}
		} else {
			// if it doesnt have different styles:

			// return elements in current folder
			layers.push({
				id: index + extraIndex,
				name: layerObj.name,
				location: path,
				elements: getElements(path),
				position: { x: 0, y: 0 },
				size: { width: format.width, height: format.height },
				number: count,
			});
		}
	});
	return layers;
};

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

const addMetadata = (_edition) => {
	let dateTime = Date.now();
	let tempMetadata = {
		hash: hash.join(""),
		decodedHash: decodedHash,
		edition: _edition,
		date: dateTime,
		attributes: attributes,
	};
	metadata.push(tempMetadata);
	attributes = [];
	hash = [];
	decodedHash = [];
};

const addAttributes = (_element, _layer) => {
	let tempAttr = {
		id: _element.id,
		layer: _layer.name,
		name: _element.name,
		rarity: _element.rarity,
	};
	attributes.push(tempAttr);
	hash.push(_layer.id);
	hash.push(_element.id);
	decodedHash.push({ [_layer.id]: _element.id });
};

const drawLayer = async (_layer, _edition) => {
	const rand = Math.random();
	let element = _layer.elements[Math.floor(rand * _layer.number)]
		? _layer.elements[Math.floor(rand * _layer.number)]
		: null;
	if (element) {
		addAttributes(element, _layer);
		const image = await loadImage(`${_layer.location}${element.fileName}`);

		ctx.drawImage(
			image,
			_layer.position.x,
			_layer.position.y,
			_layer.size.width,
			_layer.size.height
		);
		saveLayer(canvas, _edition);
	}
};

const createFiles = async (edition) => {
	let numDupes = 0;
	for (let i = 1; i <= edition; i++) {
		const layers = layersSetup(layersOrder);
		await layers.forEach(async (layer) => {
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
			if (numDupes > edition) break; //prevents infinite loop if no more unique items can be created
			i--;
		} else {
			Exists.set(key, i);
			addMetadata(i);
			console.log("Creating edition " + i);
		}
	}
};

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
