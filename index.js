var five  = require("johnny-five");
var http = require("http");

var board = new five.Board();
var led;


board.on("ready", function() {
	led = new five.Led(13);
  	var  button = new five.Button(2);

  // Button Event API

  // "down" the button is pressed
  button.on("down", function() {
	console.log("down");
/*
 * You need to replce the xxxxxxx with your api key to make this work!
 */

http.get("http://api.wunderground.com/api/xxxxxxxxx/conditions/q/UK/London.json", function(req) 
	{
		// set encoding so this comes out as text instead of goop
		req.setEncoding('utf8');
		
		req.on("data", function(data) 
		{ 
			var pulseTime = 200;
			
			try {
			
				var obj = JSON.parse(data);
				
				//console.log(obj.response);
				console.log("current temp in c: " +  obj["current_observation"]["temp_c"]);
				
				// get temp in C as whole number (integer)
				var tempC = parseInt( obj["current_observation"]["temp_c"], 10); 

				// flash LED					
				console.log("pulse");
				// "pulse" the led in a looping interval
				// Interval defaults to 1000ms
				// pinMode is will be changed to PWM automatically
				led.strobe(pulseTime);
				
				// Turn off the led pulse loop after x milliseconds
				setTimeout( function() {				
					led.stop().off();
					console.log("off");
				}, pulseTime*tempC*2 );
				
			}
			// handle errors if data is broken
			// do 3 quick blinks if so
			catch (error)
			{
				console.log("JSON Error! " + error);
				console.log(data);
				led.strobe(pulseTime/4);
				
				// Turn off the led pulse loop after x milliseconds
				setTimeout( function() {				
					led.stop().off();
					console.log("off");
				}, pulseTime/4*3*2 );
			}
	
		});
		
		req.on("error", console.error);
		
	});
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
