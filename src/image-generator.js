const basePath = process.cwd();
const fs = require("fs");
const {
  baseUri,
  fileType,
  projectName,
  projectDescription,
  author,
} = require("./config.js");
//
const buildDir = `${basePath}/build`;
const dnasFile = `${buildDir}/_DNAs.json`;
const imageDir_json = `${buildDir}/json`;

let metadata = [];

function buildSetup() {
  if (fs.existsSync(imageDir_json)) return;
  fs.mkdirSync(imageDir_json);
}

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(
    `${buildDir_png}/${_edition + 1}.png`,
    _canvas.toBuffer("image/png")
  );
};

const drawLayer = async (_layer, _edition) => {
  const image = await loadImage(_layer.path); //location will be removed

  ctx.drawImage(
    image,
    _layer.position.x,
    _layer.position.y,
    _layer.size.width,
    _layer.size.height
  );
  saveLayer(canvas, _edition);
};

async function generateImages() {
  //Setup path
  buildSetup();

  //Get Dnas
  const _dnas = JSON.parse(fs.readFileSync(dnasFile));
  //Generate Images
  const editionLength = _dnas.length;
  for (let i = 0; i < 2; i++) {
    const _dna = _dnas[i];
    let _layers = _dna.attributes;
    if (_layers[i].path === undefined) {
      _layers = _layers.shift();
    }
    console.log(_layers);

    // //generate layers
    // for (const _layer of _layers) {
    //   await drawLayer(_layer, i);
    // }
  }
}
generateImages();
