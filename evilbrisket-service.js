/*
	Copyright (c) 2017,  Evil Brisket, LLC
	All rights reserved.
*/

var util = require('util');
var bleno = require('bleno');
var Evilbrisket = require('evilbrisket');
var fs = require('fs');
var rest = require('restler');

var EvilBrisketTemperatureCharacteristic = require('./characteristics/temperature');
var EvilBrisketBoardCharacteristic = require('./characteristics/board');

var evilbrisket = new Evilbrisket();

var endpoint = "https://app.evilbrisket.com/api/temperature"
var token = null;

try {
	token = fs.readFileSync('./.evilbrisket', 'utf8').trim();
} catch (e) { }

var defaultProbeManufacturer = evilbrisket.PROBE_MANUFACTURER.THERMOWORKS;

try {
	defaultProbeManufacturer = parseInt(fs.readFileSync('./.manufacturer', 'utf8').trim());
	console.log("Setting probe manufacturer to saved value: " + defaultProbeManufacturer);
} catch (e) { }

evilbrisket.init();
evilbrisket.use_probe(defaultProbeManufacturer);

setInterval(function() {
	
	var temperatures = evilbrisket.readAllProbes();
	
 	if (token) {
		 
	 evilbrisket.led(evilbrisket.LED.GREEN, 1);
	 
	 var data = {temperatures : temperatures};
	 
	 rest.post(endpoint, { 
	   	multipart: false,
	 	data: JSON.stringify(data),
		accessToken: token,
		headers: { 'content-type' : 'application/json',
		 			'User-Agent': 'EvilBrisket Board'
	 }}).on('complete', function(data, response) {
		 
		 if (response == null) {
		 	
			// No WiFi
			console.log("No network connection?");
			
		 } else {
		 	
			 if (response.statusCode == 201) {
			 	//console.log("Data uploaded successfully.")
			 }
		 
			 if (response.statusCode == 401 || response.statusCode == 403) {
			 	console.log("User not authorized. Removing old token if it exists.")
				 try {
					 fs.unlinkSync('./.evilbrisket');
				 } catch (e) {}
			 }
		 
			 if (response.statusCode == 400) {
			 	console.log("Bad request?")
			 }
		 
			 if (response.statusCode == 404) {
			 	console.log("Unknown API call?")
			 }
			 
			 evilbrisket.led(evilbrisket.LED.GREEN, 0);
		 }
		 
		
	   	
	 });
	 
 }}, 1000);

fs.watch('.', { encoding: 'buffer' }, (eventType, filename) => {
  if (filename == '.evilbrisket') {
	  if (fs.existsSync('.evilbrisket')) {
	  	token = fs.readFileSync('./.evilbrisket', 'utf8').trim();
	  } else {
		 token = null;
	  }
  }
});

function EvilBrisketService() {
    bleno.PrimaryService.call(this, {
        uuid: '893D199E-3B7C-40D4-B7BC-7F3EEEB5B489',
        characteristics: [
		    new EvilBrisketBoardCharacteristic(evilbrisket),
			new EvilBrisketTemperatureCharacteristic(evilbrisket)
        ]
    });
}

EvilBrisketService.prototype.bleConnected = function() {
	evilbrisket.led(evilbrisket.LED.BLUE, 1)
};

EvilBrisketService.prototype.bleDisconnected = function() {
	evilbrisket.led(evilbrisket.LED.BLUE, 0)
};

util.inherits(EvilBrisketService, bleno.PrimaryService);

module.exports = EvilBrisketService;