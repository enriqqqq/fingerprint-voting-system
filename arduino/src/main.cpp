#include <Arduino.h>
#include <Adafruit_Fingerprint.h>
#include <SoftwareSerial.h>
#include <LiquidCrystal_I2C.h>

#define REGISTER_MODE 0x01
#define LOAD_MODE 0x02
#define VOTING_MODE 0x03

#define INCOMING_FINGERPRINTS 0x7A79
#define SWITCH_TO_REGISTER_MODE 0x7879

SoftwareSerial mySerial(2, 3);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);
LiquidCrystal_I2C lcd(0x27, 16, 2);

uint8_t getFingerprintID(); uint8_t getFingerprintModel(); uint8_t getAndUploadFingerpintTemplate(); uint8_t downloadFingerprints();

int mode;
uint8_t replyBuffer[10];
uint8_t replyIdx = 0;

uint8_t vdot_idx = 0; // for voting mode (display only)

void setup() {
  Serial.begin(9600);
  lcd.init();
  lcd.backlight();

  // set the data rate for the sensor serial port
  lcd.print(F("Finding sensor"));
  finger.begin(9600);
  delay(1000);
  if (finger.verifyPassword()) {
    lcd.clear();
    lcd.print(F("Found sensor!"));
  } else {
    lcd.clear();
    lcd.print(F("No Sensor"));
    while (1);
  }

  lcd.setCursor(0,0);
  lcd.print(F("  Place finger "));
  mode = REGISTER_MODE;
}

void loop() {
  switch (mode) {
    case REGISTER_MODE:
      getAndUploadFingerpintTemplate();
      delay(1500);
      break;
    case LOAD_MODE:
      downloadFingerprints();
      break;
    case VOTING_MODE:
      getFingerprintID();
      break;
  }
}

uint8_t getFingerprintModel() {
  int p = -1;
  // Waiting for a finger
  lcd.setCursor(0,0);
  lcd.print(F("  Place finger "));

  lcd.clearRow(1);
  lcd.setCursor(0,1);
  uint8_t dot_idx = 0;
  uint8_t byte;

  while(p != FINGERPRINT_OK) {
    // get INCOMING_FINGERPRINTS code, if it is received, switch to LOAD_MODE
    if(Serial.available()) {
      byte = Serial.read();

      switch(replyIdx) {
        case 0:
          if(byte == (INCOMING_FINGERPRINTS >> 8)) {
            replyBuffer[replyIdx] = byte;
            replyIdx++;
          }
          break;
        case 1:
          if(byte == (INCOMING_FINGERPRINTS & 0xFF)) {
            replyBuffer[replyIdx] = byte;
            replyIdx++;
          } else {
            replyIdx = 0;
          }
          break;
        case 10:
          memset(replyBuffer, 0xFF, 10);
          Serial.write(0x09); // error occured
          replyIdx = 0;
          break;
      }

      // Serial.println(replyIdx);
    }
  
    if( replyIdx == 2 &&
        replyBuffer[0] == (INCOMING_FINGERPRINTS >> 8   ) &&
        replyBuffer[1] == (INCOMING_FINGERPRINTS & 0xFF) ) { 
        
        mode = LOAD_MODE; 
        replyIdx = 0;
        lcd.setCursor(0,0);
        lcd.print("    Loading    ");
        lcd.setCursor(0,1);
        lcd.print("Fingerprint 000");
        return 5;
    }

    // get fingerprint image
    p = finger.getImage();
    switch(p) {
      case FINGERPRINT_OK:
        // image taken
        lcd.setCursor(0,0);
        lcd.print(F("  Image taken  "));
        dot_idx = 0;
        // Serial.println(F("Image taken"));
        break;
      case FINGERPRINT_NOFINGER:
        // no finger detected
        lcd.print(F("."));
        dot_idx++;
        if (dot_idx > 15) {
          lcd.clearRow(1);
          dot_idx = 0;
          lcd.setCursor(0,1);
        }
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        // communication error

      case FINGERPRINT_IMAGEFAIL:
        // image capture error

      default:
        // unknown error
        lcd.setCursor(0,0);
        lcd.print(F("     Error     "));
        lcd.setCursor(0,1);
        lcd.print(F("    Occurred   "));
        break;
    }
  }
  // OK success!

  // convert image to template and store in charbuffer 1
  p = finger.image2Tz(1);
  if(p != FINGERPRINT_OK) {
    // error
    lcd.setCursor(0,0);
    lcd.print(F("     Error     "));
    lcd.setCursor(0,1);
    lcd.print(F("    Occurred   "));
    return p;
  }

  // switch(p) {
  //   case FINGERPRINT_OK:
  //     // image converted
  //     break;
  //   case FINGERPRINT_IMAGEMESS:
  //     // image too messy
  //     return p;
  //   case FINGERPRINT_PACKETRECIEVEERR:
  //     // communication error
  //     return p;
  //   case FINGERPRINT_FEATUREFAIL:
  //     // could not find fingerprint features
  //     return p;
  //   case FINGERPRINT_INVALIDIMAGE:
  //     // could not find fingerprint features
  //     return p;
  //   default:
  //     // unknown error
  //     return p;
  // }

  // waiting for finger to be removed
  // Serial.println(F("Remove finger"));

  delay(500);

  lcd.clearRow(1);
  lcd.setCursor(0,0);
  lcd.print(F(" Remove finger "));

  delay(2000);

  // check if finger is removed
  p = 0;
  while(p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
  }

  // get same finger again
  p = -1;
  // Waiting for a finger
  // Serial.println(F("Place same finger again"));

  lcd.setCursor(0,0);
  lcd.print(F("Use same finger"));
  lcd.setCursor(0,1);

  while(p != FINGERPRINT_OK) {
    p = finger.getImage();
    switch(p) {
      case FINGERPRINT_OK:
        // image taken
        break;
      case FINGERPRINT_NOFINGER:
        // no finger detected
        lcd.print(F("."));
        dot_idx++;
        if (dot_idx > 15) {
          dot_idx = 0;
          lcd.clearRow(1);
          lcd.setCursor(0,1);
        }
        break;
      case FINGERPRINT_PACKETRECIEVEERR:
        // communication error
        break;
      case FINGERPRINT_IMAGEFAIL:
        // image capture error
        break;
      default:
        // unknown error
        break;
    }
  }
  // OK Success!

  // convert image to template and store in charbuffer 2
  p = finger.image2Tz(2);

  if(p != FINGERPRINT_OK) {
    // error
    lcd.setCursor(0,0);
    lcd.print(F(" Error Occured "));
    lcd.clearRow(1);
    return p;
  }

  // switch(p) {
  //   case FINGERPRINT_OK:
  //     // image converted
  //     break;
  //   case FINGERPRINT_IMAGEMESS:
  //     // image too messy
  //     return p;
  //   case FINGERPRINT_PACKETRECIEVEERR:
  //     // communication error
  //     return p;
  //   case FINGERPRINT_FEATUREFAIL:
  //     // could not find fingerprint features
  //     return p;
  //   case FINGERPRINT_INVALIDIMAGE:
  //     // could not find fingerprint features
  //     return p;
  //   default:
  //     // unknown error
  //     return p;
  // }

  // create model
  p = finger.createModel();
  switch(p) {
    case FINGERPRINT_OK:
      // model created
      lcd.setCursor(0,0);
      lcd.print(F("Model created"));
      lcd.clearRow(1);
      return p;

    case FINGERPRINT_PACKETRECIEVEERR:
      // communication error
      
    case FINGERPRINT_ENROLLMISMATCH:
      // fingerprints did not match
      
    default:
      // unknown error
        lcd.setCursor(0,0);
        lcd.print(F("     Error     "));
        lcd.setCursor(0,1);
        lcd.print(F("    Occurred   "));
      return p;
  }

  // should not reach here
  return p;
}

uint8_t getFingerprintID() {
  uint8_t byte;
  if(Serial.available()) {
      byte = Serial.read();

      switch(replyIdx) {
        case 0:
          if(byte == (SWITCH_TO_REGISTER_MODE >> 8)) {
            replyBuffer[replyIdx] = byte;
            replyIdx++;
          }
          break;
        case 1:
          if(byte == (SWITCH_TO_REGISTER_MODE & 0xFF)) {
            replyBuffer[replyIdx] = byte;
            replyIdx++;
          } else {
            replyIdx = 0;
          }
          break;
        case 10:
          memset(replyBuffer, 0xFF, 10);
          replyIdx = 0;
          break;
      }

      // Serial.println(replyIdx);
    }
  
    if( replyIdx == 2 &&
        replyBuffer[0] == (SWITCH_TO_REGISTER_MODE >> 8   ) &&
        replyBuffer[1] == (SWITCH_TO_REGISTER_MODE & 0xFF) ) { 
        
        mode = REGISTER_MODE; 
        replyIdx = 0;
        vdot_idx = 0;
        lcd.setCursor(0,0);
        lcd.print("  Place finger  ");
        lcd.clearRow(1);
        return 5;
    }

  uint8_t p = finger.getImage();
  switch (p) {
    case FINGERPRINT_OK:
      lcd.setCursor(0,0);
      lcd.print(F("  Image taken   "));
      lcd.clearRow(1);
      vdot_idx = 0;
      delay(500);
      break;
    case FINGERPRINT_NOFINGER:
      lcd.setCursor(vdot_idx,1);
      lcd.print(F("."));
      vdot_idx++;
      if (vdot_idx > 15) {
        vdot_idx = 0;
        lcd.clearRow(1);
      }
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      // Serial.println(F("Communication error"));
      // return p;
    case FINGERPRINT_IMAGEFAIL:
      // Serial.println(F("Imaging error"));
      // return p;
    default:
      lcd.setCursor(0,0);
      lcd.print(F("     Error      "));
      lcd.setCursor(0,1);
      lcd.print(F("    Occurred    "));
      delay(500);
      vdot_idx = 0;
      lcd.clearRow(1);
      lcd.setCursor(0,0);
      lcd.print(F("Place finger [v]"));
      lcd.clearRow(1);
      return p;
  }

  // OK success!

  p = finger.image2Tz();
  switch (p) {
    case FINGERPRINT_OK:
      lcd.setCursor(0,0);
      lcd.print(F("Image converted "));
      delay(500);
      break;
    case FINGERPRINT_IMAGEMESS:
      lcd.setCursor(0,0);
      lcd.print(F("Image too messy "));
      delay(500);
      lcd.setCursor(0,0);
      lcd.print(F("Place finger [v]"));
      lcd.clearRow(1);
      return p;
    case FINGERPRINT_PACKETRECIEVEERR:
      lcd.setCursor(0,0);
      lcd.print(F(" Communication "));
      lcd.setCursor(0,1);
      lcd.print(F("     Error     "));
      delay(500);
      lcd.setCursor(0,0);
      lcd.print(F("Place finger [v]"));
      lcd.clearRow(1);
      return p;
    case FINGERPRINT_FEATUREFAIL:
      // Serial.println(F("Could not find fingerprint features"));
      // return p;
    case FINGERPRINT_INVALIDIMAGE:
      lcd.setCursor(0,0);
      lcd.print(F("      Try       "));
      lcd.setCursor(0,1);
      lcd.print(F("     Again      "));
      delay(500);
      lcd.setCursor(0,0);
      lcd.print(F("Place finger [v]"));
      lcd.clearRow(1);
      return p;
    default:
      lcd.setCursor(0,0);
      lcd.print(F("     Error      "));
      lcd.setCursor(0,1);
      lcd.print(F("    Occurred    "));
      delay(500);
      lcd.setCursor(0,0);
      lcd.print(F("Place finger [v]"));
      lcd.clearRow(1);
      return p;
  }

  // OK converted!
  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    lcd.setCursor(0,0);
    lcd.print(F("  Fingerprint  "));
    lcd.setCursor(0,1);
    lcd.print(F("     Found     "));
  } else if (p == FINGERPRINT_PACKETRECIEVEERR) {
    lcd.setCursor(0,0);
    lcd.print(F(" Communication "));
    lcd.setCursor(0,1);
    lcd.print(F("     Error     "));
    delay(500);
    lcd.setCursor(0,0);
    lcd.print(F("Place finger [v]"));
    lcd.clearRow(1);
    return p;
  } else if (p == FINGERPRINT_NOTFOUND) {
    lcd.setCursor(0,0);
    lcd.print(F("  Fingerprint  "));
    lcd.setCursor(0,1);
    lcd.print(F("   Not found   "));
    delay(1000);
    lcd.setCursor(0,0);
    lcd.print(F("Place finger [v]"));
    lcd.clearRow(1);
    return p;
  } else {
    lcd.setCursor(0,0);
    lcd.print(F("     Error     "));
    lcd.setCursor(0,1);
    lcd.print(F("    Occurred   "));
    delay(500);
    lcd.setCursor(0,0);
    lcd.print(F("Place finger [v]"));
    lcd.clearRow(1);
    return p;
  }

  // found a match!
  // Serial.print(F("Found ID #")); Serial.print(finger.fingerID);
  // Serial.print(F(" with confidence of ")); Serial.println(finger.confidence);
  Serial.write(finger.fingerID);
  delay(1000);
  lcd.clearRow(1);
  lcd.setCursor(0,0);
  lcd.print(F("Place finger [v]"));

  return finger.fingerID;
}

uint8_t getAndUploadFingerpintTemplate()
{
  int p = getFingerprintModel();
  if(p != FINGERPRINT_OK) {
    // error occurred
    return p;
  }

  lcd.setCursor(0,0);
  lcd.print(F("Uploading model"));

  p = finger.getModel(); // need to immediately read the model after calling getModel()
  switch (p) {
    case FINGERPRINT_OK:;
      // read model immediately
      break;
   default:
      lcd.setCursor(0,0);
      lcd.print(F("     Error     "));
      lcd.setCursor(0,1);
      lcd.print(F("   Occurred    "));
      return p;
  }
  
  // get necessary calculations
  int packageCount = TEMPLATE_SIZE / PACKET_SIZE;
  int packageSize = PACKET_SIZE + 11;
  int totalBytes = packageSize * packageCount;

  // initialize template buffer
  uint8_t templateBuffer[totalBytes];
  memset(templateBuffer, 0xffff, totalBytes); 

  int index=0;
  uint32_t starttime = millis();
  while ((index < totalBytes) && ((millis() - starttime) < 2000))
  {
    if (mySerial.available()>0)
    {
      templateBuffer[index] = mySerial.read();
      index++;
    }
  }
  
  // Serial.print(index); Serial.println(F(" bytes read"));

  Serial.write(0x01); // code for uploading fingerprint template
  // there is 3 packages to upload, 256 bytes with 11 bytes header and checksum.
  for(int i = 0; i < packageCount; i++) {
    int start_index = i * packageSize;

    // start_index + 9 -> skip the header byte
    // start_index + 9 + PACKET_SIZE -> end at the end of the packet and skip the checksum byte
    for(int j = start_index + 9; j < start_index + 9 + PACKET_SIZE; j++){
      // send the actual fingerprint data
      Serial.write(templateBuffer[j]);

      // Serial.print("0x");
      // Serial.print(templateBuffer[j],HEX);
      // Serial.print(", ");
    }
  }

  // // dump entire templateBuffer.
  // for (int i = 0; i < totalBytes; i++)
  // {
  //   Serial.print("0x");
  //   Serial.print(templateBuffer[i],HEX);
  //   Serial.print(", ");

  //   if ((i+1) % packageSize == 0)
  //     Serial.print("\n\n");
  // }

  return p;
}

uint8_t downloadFingerprints() {
  int p = finger.emptyDatabase();
  if(p != FINGERPRINT_OK) {
    Serial.write(p);
    mode = REGISTER_MODE;
    return p;
  }

  Serial.write(0x00); // reply  with 0x00

  uint8_t templateBuffer[768];
  uint8_t byte;
  uint16_t i = 0;
  uint16_t id = 1;
  char idbuffer[4];

  // receive unknown amount of fingerprints
  // start with 0xAA, reply with 0x00
  // each fingerprint data is 768 bytes
  // download each fingerprint data one by one
  while(true) {
    // get incoming fingerprint data
    if(!Serial.available()) continue;

    // something is available
    byte = Serial.read();

    // transmission complete
    if(byte == 0x00 && i == 0) {
      mode = VOTING_MODE;
      delay(750);
      lcd.setCursor(0,0);
      lcd.print(F("Place finger [v]"));
      lcd.clearRow(1);
      return 0;
    }

    if(byte == 0xAA && i == 0) 
    {
      uint32_t starttime = millis();

      // receive fingerprint data
      while(i < 768 && (millis() - starttime) < 2000) {
        if(Serial.available() > 0) {
          templateBuffer[i] = Serial.read();
          i++;
        }
      }

      // check if timeout or incomplete data
      if(i != 768) {
        Serial.write(0x09);   // error occured
        mode = REGISTER_MODE; 
        return 9;
      }

      // download fingerprint data to buffer 1
      p = finger.downloadModel(templateBuffer, 768);
      if(p != FINGERPRINT_OK) {
        Serial.write(p);
        mode = REGISTER_MODE;
        return p;
      }

      // store fingerprint data to location id
      p = finger.storeModel(id);
      if(p != FINGERPRINT_OK) {
        Serial.write(p);
        mode = REGISTER_MODE;
        return p;
      }
      
      sprintf(idbuffer, "%03d", id);
      lcd.setCursor(12,1);
      lcd.print(idbuffer);

      id++;
      i = 0;
      Serial.write(0x00); // reply with 0x00
    }
  }
}
