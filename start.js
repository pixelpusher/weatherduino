/*
 * A starting point for using buttons using
 * NodeJS, Johnny-Five and Arduino
 *
 * With node.js installed, start the server with the command:
 * "node buzzersound.js"
 *
 * by Evan Raskob info@pixelist.info 2015
 */

var five  = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

    var led = new five.Led(13);
  	var button = new five.Button(2);


  // Button Event API

  // "down" the button is pressed
  button.on("down", function() {
	console.log("down");
  });
  
  
  // "hold" the button is pressed for specified time.
  //        defaults to 500ms (1/2 second)
  //        set
  button.on("hold", function() {
    console.log("hold");
  });

  // "up" the button is released
  button.on("up", function() {
    console.log("up");
  });
  
});
