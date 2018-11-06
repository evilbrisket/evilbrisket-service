/*
	Copyright (c) 2017,  Evil Brisket, LLC
	All rights reserved.
*/

var util = require('util');
var bleno = require('bleno');

var EvilBrisketTemperatureCharacteristic = function(board) {
	this.board = board;
	EvilBrisketTemperatureCharacteristic.super_.call(this, {
	    uuid: '0121',
	    properties: ['read', 'notify'],
	    descriptors: [
	      new bleno.Descriptor({
	        uuid: '2901',
	        value: 'Temperature Readings (F)'
	      })
	    ]
	  });
};

util.inherits(EvilBrisketTemperatureCharacteristic, bleno.Characteristic);

EvilBrisketTemperatureCharacteristic.prototype.resultBuffer = [];


EvilBrisketTemperatureCharacteristic.prototype.onReadRequest = function(offset, callback) {
	if (offset == 0) {
		var temperatures = this.board.lastRead();
		if (temperatures != null) {
			this.resultBuffer = new Buffer(JSON.stringify(temperatures));
		} 
	 }	
    callback(this.RESULT_SUCCESS,this.resultBuffer.slice(offset, this.resultBuffer.length));
};

EvilBrisketTemperatureCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	console.log("Subscriber Connected.");
	var board = this.board;
	this.timer = setInterval(function() {
		if (updateValueCallback) {
			var temperatures = board.lastRead();
			if (temperatures != null) {
				updateValueCallback(new Buffer(JSON.stringify(temperatures)));
			}
		}
	}, 800);
};

EvilBrisketTemperatureCharacteristic.prototype.onUnsubscribe = function(maxValueSize, updateValueCallback) {
	 console.log("Subscriber Disconnected.");
	 clearInterval(this.timer);
	 this.timer = null;
};

module.exports = EvilBrisketTemperatureCharacteristic;