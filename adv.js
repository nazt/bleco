const parser = require("./parser/env");
const DB = require("./Data");
const noble = require("@abandonware/noble");
// var sha256 = require('sha256')
const sha256 = require("js-sha256").sha256;
noble.on("stateChange", (state) => {
  if (state === "poweredOn") {
    console.log("Scanning");
    noble.startScanning(["181a"], true);
  } else {
    noble.stopScanning();
  }
});
// connectAndSetUp(require('./cobike.jso'))

// let orig = {};

noble.on("discover", (peripheral) => {
  const name = peripheral.advertisement.localName;
  console.log(`name = ${name}`);
  console.log("---------------------------------");
  const result = parser.parse(peripheral.advertisement.serviceData[0].data);
  DB.set(result.uuid, result);
  // store[result.uuid] = result;
});
