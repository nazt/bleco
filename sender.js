const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://mqtt.artisandigital.tech");

client.on("connect", function () {
  console.log(`mqtt connected.`);
  //   client.subscribe("presence", function (err) {
  //     if (!err) {
  //         console.lo
  //     }
  //   });
});

client.on("message", function (topic, message) {
  console.log(message.toString());
});

module.exports = {
  client,
  publish: (topic, message, opts) => {
    client.publish(topic, message, opts);
    // console.log(`publish called()`);
  },
};
