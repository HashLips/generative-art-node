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
const buildDir_json = `${buildDir}/json`;

function replaceUris() {
  //add uri to _DNAs.json and from there to metadatas
}

module.exports = { replaceUris };
