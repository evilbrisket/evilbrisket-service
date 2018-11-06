/*
	Copyright (c) 2017,  Evil Brisket, LLC
	All rights reserved.
*/

process.env['BLENO_DEVICE_NAME'] = 'Evil Brisket Board';
process.env['BLENO_ADVERTISING_INTERVAL']= 30

var bleno = require('bleno');

var EvilBrisketService = require('./evilbrisket-service');
var evilBrisketService = new EvilBrisketService();

bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    bleno.startAdvertising('EvilBrisket', [evilBrisketService.uuid], function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
  else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(err) {
  if (!err) {
    console.log('Evil Brisket BLE service is advertising.');
    bleno.setServices([
      evilBrisketService
    ]);
  }
});

bleno.on('accept', function(clientAddress) {
	console.log("Connected.");
	evilBrisketService.bleConnected();
});

bleno.on('disconnect', function(clientAddress) {
	console.log("Disconnected.");
	evilBrisketService.bleDisconnected();
});