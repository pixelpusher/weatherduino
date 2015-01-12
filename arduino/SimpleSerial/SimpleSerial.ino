
void setup()
{
  // start serial port at 9600 bps and wait for port to open:
  Serial.begin(9600);

  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
}

void loop()
{
  // if we get a valid byte, read analog ins:

  if (Serial.available() > 0) {
    
    // get incoming byte:
    byte inByte = Serial.read();
    
    Serial.print("received byte:");
    Serial.println((char)inByte);
    
    char received = (char)inByte;
    
    if ( received == 'c')
    {
      digitalWrite(13,HIGH);
    }
    else
    {
      digitalWrite(13,LOW);
    }
    
   }
}

