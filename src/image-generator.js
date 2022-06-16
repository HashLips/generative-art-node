const basePath = process.cwd();
const fs = require("fs");
const { format } = require("./config.js");
const { createCanvas, loadImage } = require("canvas");

//
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

const buildDir = `${basePath}/build`;
const dnasFile = `${buildDir}/_DNAs.json`;
const imageDir_json = `${buildDir}/image`;

function buildSetup() {
  if (fs.existsSync(imageDir_json)) return;
  fs.mkdirSync(imageDir_json);
}

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(
    `${imageDir_json}/${_edition + 1}.png`,
    _canvas.toBuffer("image/png")
  );
};

const drawLayer = async (_layer, _edition) => {
  const image = await loadImage(_layer.path); //location will be removed

  ctx.drawImage(image, 0, 0, format.width, format.height);
  saveLayer(canvas, _edition);
};

async function generateImages() {
  //Setup path
  buildSetup();

  //Get Dnas
  const _dnas = JSON.parse(fs.readFileSync(dnasFile));
  //Generate Images
  const editionLength = _dnas.length;
  for (let i = 0; i < editionLength; ++i) {
    const _dna = _dnas[i];
    let _layers = _dna.attributes;
    if (_layers[0].path == undefined) {
      _layers.shift();
    }

    //generate layers
    for (const _layer of _layers) {
      await drawLayer(_layer, i);
    }
  }
}
module.exports = { generateImages };
