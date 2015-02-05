/* 
 This server connects to an arduino so you can use a button or sensor
 to start or stop playing a sound on your computer.

 With node.js installed, start the server with the command:
 "node buzzersound.js"

* by James Uren and Evan Raskob, info@pixelist.info 2013-2015
*/


var five  = require("johnny-five");
var http = require("http");
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');

var board = new five.Board(
  {
    //port: "/dev/cu.usbmodemfd121"
    //port: "/dev/cu.usbserial-A8008kUM"
    port: "/dev/cu.usbmodemfa131"
  }
); // this is the arduino

var soundFile = process.argv[2] || "sounds/coin.mp3"; // Sound filename

console.log("Sound file is " + soundFile);

board.on("ready", function() {
	var led = new five.Led(13);
  	var  button = new five.Button(2);

  	// "down" the button is pressed
  	button.on("down", function() {
  	  	console.log("Down");
		
		// Check sound file exists
		if (fs.existsSync(soundFile)) {
			// Play sound
			var $stream = fs.createReadStream(soundFile).pipe(new lame.Decoder).pipe(new Speaker);
			// Stop after 2s
			setTimeout(function() {
			    $stream.close();
			}, 2000);
		} else {
			console.log("ERROR: Sound file " + soundFile + " does not exist...");
		}
  	});
  
  	// "hold" the button is pressed for specified time.
  	//        defaults to 500ms (1/2 second)
  	//        set
  	button.on("hold", function() {
  		console.log("Hold");
	});

  	// "up" the button is released
  	button.on("up", function() {
  		console.log("Up");
  	});
});
