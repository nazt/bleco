const Parser = require("binary-parser").Parser;
const formatters = require("./formatter");
const parser = Parser.start()
  .endianess("big")
  .array("uuid", {
    type: "uint8",
    length: 6,
    formatter: formatters.toHextString,
  })
  .int16("temp", { formatter: (val) => parseFloat((val * 0.1).toFixed(2)) })
  .uint8("humid")
  .uint8("battP")
  .int16("battV", { formatter: (val) => parseFloat((val * 0.001).toFixed(2)) })
  .uint8("counter");

module.exports = parser;
