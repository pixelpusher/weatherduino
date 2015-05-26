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


byte serialBuffer[12]; // 3-digit color codes plus commas plus command character

// states
const byte READING_COLOR_STATE = 'r';
const byte IDLE_STATE = 'i';

byte CurrentState = IDLE_STATE; // reading
byte MessageBytesLeftToRead = 0; // bytes left to read in current command
boolean updateLEDs = false; // should we broadcast commands to LEDs?



void setup() {

  Serial.begin(57600);
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

  // read into serial buffer
  byte bytesToRead = Serial.available();

  if ( bytesToRead > 0) 
  {
    Serial.print(bytesToRead);
    Serial.print(" bytes. ");


    switch (CurrentState)
    {

    case IDLE_STATE:
      // we are waiting for a command byte.
      // read the first byte received in Serial and look for a command byte (0,1,2)

      byte cmd = Serial.read();

      // might receive 2 or more commands in a single Serial transmission... need recursion

      switch( cmd )
      {

      case '0': // set color based on next 3 bytes
        {
          CurrentState = READING_COLOR_STATE;
        }
        break;

      case '1': // off
        {
          // only 1 byte command... no need for further reading
          myColor.v=0;
          updateLEDs = true;
          CurrentState = IDLE_STATE;
        }
        break;

      case '2': // on
        {
          // only 1 byte command... no need for further reading
          myColor.v=60;
          updateLEDs = true;
          CurrentState = IDLE_STATE;
        }
        break;


      default: 
        break;
      }
      //-----------------------DONE HANDLING IDLE STATE
      break;

    case READING_COLOR_STATE:
      // look for 3 more bytes (h,s,v)
      MessageBytesLeftToRead = 3;

      // now, read bytes from the serial port (may not be all 3)

      // current bytes read
      byte bytesRead = min(MessageBytesLeftToRead, bytesToRead);

      // read into buffer backwards, for speed
      while (bytesToRead--)
      {
        MessageBytesLeftToRead--;

        byte i = MessageBytesLeftToRead-1 - bytesRead;
        serialBuffer[i] = Serial.read();
        Serial.print(i,DEC);
        Serial.print('.');
        Serial.println(serialBuffer[i]);
        //      Serial.print(' ');
      }

      if (MessageBytesLeftToRead == 0)
      {          
        myColor.h = serialBuffer[0];
        myColor.s = serialBuffer[1];
        myColor.v = serialBuffer[2];

        updateLEDs = true;
      }
      //          else 
      //            Serial.println("::still processing");
      break;


      // end switch received bytes
    }
    // end serial available
  }


  // get color object as R,G,B array for neopixels
  if (updateLEDs)
  {
    uint32_t c = myColor.toRGB();

    for(int i=0;i<NUMPIXELS;i++){
      // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
      pixels.setPixelColor(i, c );
      pixels.show(); // This sends the updated pixel color to the hardware.
    }

    /*
    Serial.println("updated colour:");
     Serial.print(myColor.h);
     Serial.print(",");
     Serial.print(myColor.s);
     Serial.print(",");    
     Serial.println(myColor.v);
     */
  } 

}










