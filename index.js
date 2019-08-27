// let noble = require("noble-mac")
var noble = require('@abandonware/noble');
// var sha256 = require('sha256')
var sha256 = require('js-sha256').sha256;
noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    console.log('Scanning');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});
// connectAndSetUp(require('./cobike.jso'))

noble.on('discover', peripheral => {
    const name = peripheral.advertisement.localName;
    if (peripheral.uuid == '358ad538a9594e0db506a5b7b91bd972') {
      console.log('found device');
      console.log("-------------------------------")
      // console.log(peripheral)
      console.log(name);
      console.log("===============================")
      noble.stopScanning();
      connectAndSetUp(peripheral);
      // const fs = require('fs')
      // const JSON = require('circular-json');
      // fs.writeFileSync('./cobike.json', JSON.stringify(peripheral));
    }
});

function connectAndSetUp(peripheral) {
  peripheral.connect(error => {
    console.log('Connected to ', peripheral.advertisement.localName, peripheral.id);
    // specify the services and characteristics to discover
    const serviceUUIDs = [];
    const characteristicUUIDs = [];
    peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, (err, services, characteristics) => {

      for (let i = services.length - 1; i >= 0; i--) {
        console.log(`services[${i}] = ${services[i]}`)
      }

      for (let i = characteristics.length - 1; i >= 0; i--) {
        console.log(`characteristics[${i}] = ${characteristics[i]}`)
      }

      characteristics[1].on('notify', (args) => {
        console.log('args', args)
      })

      let pkt = 0;
      characteristics[1].on('data', (buffer) => {
        pkt++;
        console.log(`recv pkt-${pkt}:  hex=${buffer.toString('hex')}(${buffer.toString()})`)
        if (pkt == 1) {
          console.log(`[SECRET] hex=${buffer.toString('hex')}(${buffer.toString()})`);
          let buf_str = buffer.toString();
          let buf_str_trunc = sha256(`cobike${buf_str}`).substring(0, 4);
          let b = Buffer.from(["1".charCodeAt(0)]);
          b = Buffer.concat([b, Buffer.from(buf_str_trunc, 'hex')])
          console.log('------------------')
          console.log(`buf_str_trunc=${buf_str_trunc}`)
          console.log(`Sending buffer=`, b);
          console.log('------------------')
          characteristics[0].write(b, false, function(err) {
            console.log('write error code:', err)
            let b = Buffer.from(['Z'.charCodeAt(0)])
              characteristics[0].write(b, false, function(err) {
            })

          })
        }
        else {
          console.log('>', buffer);
          if (buffer[0] == 0x5a) {
            console.log(`code=Z lock_status=`, buffer[1].toString(16))
          }
        }
      })

      characteristics[1].subscribe(err => {
        console.log('subscribed.');
        let b = Buffer.from(['?'.charCodeAt(0)])
          characteristics[0].write(b, false, function(err) {
        })


      });


       // - 
       // (BOOL)write:(NSString*) uuid service:(NSString*) serviceUuid characteristic:(NSString*) characteristicUuid data:(NSData*) data withoutResponse:(BOOL)withoutResponse;
      // noble.writeValue('358ad538a9594e0db506a5b7b91bd972', '358ad538a9594e0db506a5b7b91bd972', '6e400002b5a3f393e0a9e50e24dcca9e', '', b)
      // , err => {
      //   console.log(err)
      // })

    })
  });
  
  peripheral.on('disconnect', () =>  {
    console.log('disconnected')
    process.exit(0);
  });
}
