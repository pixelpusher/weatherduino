// Neopixel serial communication sketch (c) 2015 Evan Raskob e.raskob@rave.ac.uk
// some code bsed on NeoPixel Ring simple sketch (c) 2013 Shae Erisson
// released under the GPLv3 license to match the rest of the AdaFruit NeoPixel library

#include <Adafruit_NeoPixel.h>
#include "HSVColor.h"

// Which pin on the Arduino is connected to the NeoPixels?
#define PIN            8

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS      16

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

HSVColori myColor(100,255,100); // h,s,v


void setup() {

  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  } 
  delay(5); // let things settle
  uint32_t c = myColor.toRGB();

  // debug:
  //Serial.println(c,BIN);

  pixels.begin(); // This initializes the NeoPixel library.
  for(int i=0;i<NUMPIXELS;i++){
    // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
    pixels.setPixelColor(i, c ); // Moderately bright green color.
    pixels.show(); // This sends the updated pixel color to the hardware.
  }
}

void loop() {

  if (Serial.available() > 0) {

    // get incoming byte:
    byte inByte = Serial.read();

    //Serial.print("received byte:");
    //Serial.println((char)inByte);

    char received = (char) inByte;

    switch( received )
    {

    case 'c': 
      {

        int h = Serial.parseInt();
        int s = Serial.parseInt();
        int v = Serial.parseInt();
        
        //Serial.println("rc:");
        Serial.print(h);
        Serial.print(',');
        Serial.print(s);
        Serial.print(',');
        Serial.println(v);
        

        myColor.h = h;
        myColor.s = s;
        myColor.v = v;
      }
      break;

    case 'o':
      {
        myColor.v=0;
      }
      break;

    case 'n':
      {
        myColor.v=60;
      }
      break;


    default: 
      break;
    }
    // end switch received bytes
/*
    Serial.println("updated colour:");
    Serial.print(myColor.h);
    Serial.print(",");
    Serial.print(myColor.s);
    Serial.print(",");    
    Serial.println(myColor.v);
*/

    // get color object as R,G,B array for neopixels

    uint32_t c = myColor.toRGB();

    for(int i=0;i<NUMPIXELS;i++){
      // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
      pixels.setPixelColor(i, c );
      pixels.show(); // This sends the updated pixel color to the hardware.
    }  
    // end serial available
  }

}



