/* -*- mode: c++; -*- */
#include <Adafruit_NeoPixel.h>
#include "HSVColor.h"
#include "CljComms.h"

#define LED 13

// Which pin on the Arduino is connected to the NeoPixels?
#define PIN            8

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS      16

#define BAUDRATE       28800

// When we setup the NeoPixel library, we tell it how many pixels, and which pin to use to send signals.
// Note that for older NeoPixel strips you might need to change the third parameter--see the strandtest
// example for more information on possible values.
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

HSVColori myColor(100,255,100); // h,s,v


CljComms comms;

void do_LED(int n, byte *args) {
  if (n >= 1) {
    byte how = args[0];

    if (how > 0) {
      digitalWrite(LED, HIGH);
    } 
    else {
      digitalWrite(LED, LOW);
    }
    comms.xmit('L', 1, &how);
  }

}

void do_PLUS(int n, byte *args) {
  short total = 0;
  for (int i = 0; i < n; i++) {
    total += args[i];
  }

  byte b[2];
  b[0] = total >> 8;
  b[1] = total & 0xFF;

  comms.xmit('+', 2, b);
}


void do_HSV(int n, byte *args) 
{
   byte response[1];
   response[0] =  '0'; // assume failure

  if (n == 3)
  {
    myColor.h = args[0];
    myColor.s = args[1];
    myColor.v = args[2];

    uint32_t c = myColor.toRGB();

    for(int i=0;i<NUMPIXELS;i++){
      // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
      pixels.setPixelColor(i, c );
      pixels.show(); // This sends the updated pixel color to the hardware.
    }
    response[0] =  '1'; // SUCCESS
  }
  comms.xmit('!', 1, response);
}


void do_Off(int n, byte *args) 
{
   byte response[1];
   response[0] =  '0'; // assume failure

  if (n >= 1)
  {
    myColor.v = 0;

    uint32_t c = myColor.toRGB();

    for(int i=0;i<NUMPIXELS;i++){
      // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
      pixels.setPixelColor(i, c );
      pixels.show(); // This sends the updated pixel color to the hardware.
    }
    response[0] =  '1'; // SUCCESS
  }
  comms.xmit('!', 1, response);
}


void do_On(int n, byte *args) 
{
   byte response[1];
   response[0] =  '0'; // assume failure

  if (n >= 1)
  {
    myColor.v = 100;

    uint32_t c = myColor.toRGB();

    for(int i=0;i<NUMPIXELS;i++){
      // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
      pixels.setPixelColor(i, c );
      pixels.show(); // This sends the updated pixel color to the hardware.
    }
    response[0] =  '1'; // SUCCESS
  }
  comms.xmit('!', 1, response);
}




void setup() {
  pinMode(LED, OUTPUT);
  
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


  comms.begin(BAUDRATE);
  comms.bind('L', do_LED);
  comms.bind('+', do_PLUS);
  comms.bind('c', do_HSV);
  comms.bind('n', do_On);
  comms.bind('o', do_Off);
}

void loop() {
  while (Serial.available() > 0) {
    comms.process(Serial.read());
  }
}


