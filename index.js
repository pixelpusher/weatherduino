var five  = require("johnny-five");
var http = require("http");

var board = new five.Board();
var led;
var me = this;


board.on("ready", function() {
	led = new five.Led(13);
  	var  button = new five.Button(2);

  // Button Event API

  // "down" the button is pressed
  button.on("down", function() {
	console.log("down");

	http.get("http://api.wunderground.com/api/b84113576c23be9c/conditions/q/UK/London.json", function(req) 
	{
		// set encoding so this comes out as text instead of goop
		req.setEncoding('utf8');
		
		req.on("data", function(data) 
		{ 
			var obj = JSON.parse(data);
			var pulseTime = 200;
			
			//console.log(obj.response);
			console.log("current temp in c: " +  obj["current_observation"]["temp_c"]);
			
			// flash LED
			
			// get temp in C as whole number (integer)
			var tempC = parseInt(obj["current_observation"]["temp_c"], 10); 
			
	
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
