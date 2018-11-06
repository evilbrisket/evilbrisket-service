var util = require('util');
var os = require('os');
var bleno = require('bleno');
var ip = require('ip');
var fs = require('fs');

var EvilBrisketBoardCharacteristic = function(board) {
 this.board = board;	
  EvilBrisketBoardCharacteristic.super_.call(this, {
    uuid: '2B19',
    properties: ['read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Board Status'
      })
    ]
  });
};

util.inherits(EvilBrisketBoardCharacteristic, bleno.Characteristic);

EvilBrisketBoardCharacteristic.prototype.onReadRequest = function(offset, callback) {
	var isAuthenticated = false;
	try {
		token = fs.readFileSync('./.evilbrisket', 'utf8').trim();
		isAuthenticated = true;
	} catch (e) { }
	
	var stats = {
		ip : ip.address(),
		hostname : os.hostname(),
		authenticated : isAuthenticated ? "true" : "false" // Make sure this is a string!
	}
	var result = new Buffer(JSON.stringify(stats));
    callback(this.RESULT_SUCCESS,result.slice(offset, result.length) );
};

EvilBrisketBoardCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  
	// TODO: Control wifi settings and account info here
  
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  } else {  
	  console.log("Read new command: ");
	  try {
	      var json = JSON.parse(data.toString('utf8'));
	  	  if (json.token != null) {
	  		  	console.log("recieved new token!");
				fs.writeFile("./.evilbrisket", json.token, function(err) {
				    if(err) {
				         console.log(err);
				    } else {
						console.log("Saved new token...");
				    }
				    
				}); 
	  	  }
		  if (json.probe != null) {
			  console.log("New probe type has been specified...");
			  this.board.use_probe(json.probe);
			fs.writeFile("./.manufacturer", json.probe, function(err) {
			    if(err) {
			         console.log(err);
			    } else {
					console.log("Updated probe manufacturer");
			    }
			    
			}); 
			  
		  } 
		  
	   } catch (e) {
		   console.log("malformed payload recieved.")
	    }

    callback(this.RESULT_SUCCESS);
  }
};



module.exports = EvilBrisketBoardCharacteristic;