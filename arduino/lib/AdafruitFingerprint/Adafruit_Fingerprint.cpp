/***************************************************
  This is a library for our optical Fingerprint sensor

  Designed specifically to work with the Adafruit Fingerprint sensor
  ----> http://www.adafruit.com/products/751

  These displays use TTL Serial to communicate, 2 pins are required to
  interface
  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing
  products from Adafruit!

  Written by Limor Fried/Ladyada for Adafruit Industries.
  BSD license, all text above must be included in any redistribution
 ****************************************************/

#include "Adafruit_Fingerprint.h"
#include <util/delay.h>
#if (ARDUINO >= 100)
  #include <SoftwareSerial.h>
#else
  #include <NewSoftSerial.h>
#endif

//static SoftwareSerial mySerial = SoftwareSerial(2, 3);

#if ARDUINO >= 100
Adafruit_Fingerprint::Adafruit_Fingerprint(SoftwareSerial *ss) {
#else
Adafruit_Fingerprint::Adafruit_Fingerprint(NewSoftSerial *ss) {
#endif
  thePassword = 0;
  theAddress = 0xFFFFFFFF;

  mySerial = ss;
}

void Adafruit_Fingerprint::debug(void){
  // uint8_t byte = 0;
  // while(true) {
  //   if(mySerial->available() > 0) {
  //     byte = mySerial->read();
  //     Serial.print("0x");
  //     Serial.print(byte, HEX);
  //     Serial.print(", ");
  //   }
  // }

  uint8_t reply[30];
  uint8_t idx = 0;
  uint32_t starttime = millis();

  while(idx < 30 && millis() - starttime < 2000) {
    if(mySerial->available()) {
      reply[idx] = mySerial->read();
      idx++;
    }
  }

  for(uint8_t i = 0; i < idx; i++) {
    Serial.print("0x");
    Serial.print(reply[i], HEX);
    Serial.print(", ");
  }

}

void Adafruit_Fingerprint::begin(uint16_t baudrate) {
  delay(1000);  // one second delay to let the sensor 'boot up'

  mySerial->begin(baudrate);
}

boolean Adafruit_Fingerprint::verifyPassword(void) {
  uint8_t packet[] = {FINGERPRINT_VERIFYPASSWORD,
                      (thePassword >> 24), (thePassword >> 16),
                      (thePassword >> 8), thePassword};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, 7, packet);
  uint8_t len = getReply(recvPacket);

  if ((len == 1) && (recvPacket[0] == FINGERPRINT_ACKPACKET) && (recvPacket[1] == FINGERPRINT_OK))
    return true;

  // Serial.print("\nGot packet type "); Serial.print(packet[0]);
  // Serial.println(len);
  // for (uint8_t i=1; i<len+1;i++) {
  //   Serial.print(" 0x");
  //   Serial.print(packet[i], HEX);
  //   delay(10);
  // }

  return false;
}
//baudrate
uint8_t Adafruit_Fingerprint::setSysParaBaud(void) {
  uint8_t packet[] = {0x0e,4,1};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(packet);

  if ((len != 1) && (packet[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return packet[1];
}
//package size
uint8_t Adafruit_Fingerprint::setSysParaSize(void) {
  uint8_t packet[] = {0x0e,6,4};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(packet);

  if ((len != 1) && (packet[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return packet[1];
}

uint8_t Adafruit_Fingerprint::getImage(void) {
  uint8_t packet[] = {FINGERPRINT_GETIMAGE};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, 3, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return recvPacket[1];
}

uint8_t Adafruit_Fingerprint::image2Tz(uint8_t slot) {
  uint8_t packet[] = {FINGERPRINT_IMAGE2TZ, slot};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return recvPacket[1];
}


uint8_t Adafruit_Fingerprint::createModel(void) {
  uint8_t packet[] = {FINGERPRINT_REGMODEL};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return recvPacket[1];
}


uint8_t Adafruit_Fingerprint::storeModel(uint16_t id) {
  uint8_t packet[] = {FINGERPRINT_STORE, 0x01, id >> 8, id & 0xFF};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return recvPacket[1];
}

uint8_t Adafruit_Fingerprint::storeModel2(uint16_t id) {
  uint8_t packet[] = {FINGERPRINT_STORE, 0x02, id >> 8, id & 0xFF};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return recvPacket[1];
}

//read a fingerprint template from flash into Char Buffer 1
uint8_t Adafruit_Fingerprint::loadModel(uint16_t id) {
    uint8_t packet[] = {FINGERPRINT_LOAD, 0x01, id >> 8, id & 0xFF};
    writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
    // debug();
    uint8_t len = getReply(recvPacket);
	if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
        return -1;
    return recvPacket[1];

}

//read a fingerprint template from flash into Char Buffer 2
uint8_t Adafruit_Fingerprint::loadModeltwo(uint16_t id) {
    uint8_t packet[] = {FINGERPRINT_LOAD, 0x02, id >> 8, id & 0xFF};
    writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
    uint8_t len = getReply(recvPacket);

    if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
        return -1;
    return recvPacket[1];

}

//transfer a fingerprint template from Char Buffer 1 to host computer
uint8_t Adafruit_Fingerprint::getModel(void) {
    uint8_t packet[] = {FINGERPRINT_UPLOAD, 0x01};
    writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
    // debug();
    uint8_t len = getReply(recvPacket);

    if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
        return -1;
    return recvPacket[1];
    return recvPacket[2];
}

//transfer a fingerprint template from Char Buffer 1 to host computer
uint8_t Adafruit_Fingerprint::getModel2(void) {
    uint8_t packet[] = {FINGERPRINT_UPLOAD, 0x02};
    writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
    uint8_t len = getReply(recvPacket);
    if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
        return -1;
    return recvPacket[1];
    return recvPacket[2];
}


uint8_t Adafruit_Fingerprint::deleteModel(uint16_t id) {
    uint8_t packet[] = {FINGERPRINT_DELETE, id >> 8, id & 0xFF, 0x00, 0x01};
    writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
    uint8_t len = getReply(recvPacket);

    if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
        return -1;
    return recvPacket[1];
}

uint8_t Adafruit_Fingerprint::emptyDatabase(void) {
  uint8_t packet[] = {FINGERPRINT_EMPTY};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;
  return recvPacket[1];
}

uint8_t Adafruit_Fingerprint::fingerFastSearch(void) {
  fingerID = 0xFFFF;
  confidence = 0xFFFF;
  // high speed search of slot #1 starting at page 0x0000 and page #0x00FF
  uint8_t packet[] = {FINGERPRINT_HISPEEDSEARCH, 0x01, 0x00, 0x00, 0x00, 0xFF};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;

  fingerID = recvPacket[2];
  fingerID <<= 8;
  fingerID |= recvPacket[3];

  confidence = recvPacket[4];
  confidence <<= 8;
  confidence |= recvPacket[5];

  return recvPacket[1];

}

// this code works.
// when sending the 256 packet, make sure that in the writePacket function the loop increment variable is set to uint16_t or else it will make an infinite loop
uint8_t Adafruit_Fingerprint::downloadModel(uint8_t* fingerprintTemplate, int size) {
  if(size != TEMPLATE_SIZE) {
    return -1;
  }

  // send command packet and verify the response
  uint8_t packet[] = {FINGERPRINT_DOWNLOAD, 0x01};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  delay(10);
  uint8_t len = getReply(packet);

  if ((len != 1) && (packet[0] != FINGERPRINT_ACKPACKET))
    return -1;

  // count the number of packets to be sent (768/256 = 3)
  int packetCount = TEMPLATE_SIZE / PACKET_SIZE;
  uint8_t packageType = FINGERPRINT_DATAPACKET;

  // send the data packets
  for(int i = 0; i < packetCount; i++) {
    if(i == packetCount - 1) packageType = FINGERPRINT_ENDDATAPACKET;
    writePacket(theAddress, packageType, PACKET_SIZE + 2, fingerprintTemplate + (i * PACKET_SIZE));
    delay(10);  
  }

  return packet[1];
}

uint8_t Adafruit_Fingerprint::getMatch(void) {

confidence = 0xFFFF;

 // matching

      uint8_t packet[] = {FINGERPRINT_MATCH, 0x01};
      writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
    uint8_t len = getReply(packet);

  if ((len != 1) && (packet[0] != FINGERPRINT_ACKPACKET))
   return -1;


  confidence = packet[2];
  confidence <<= 8;
  confidence |= packet[3];

  return packet[1];
}


uint8_t Adafruit_Fingerprint::getTemplateCount(void) {
  templateCount = 0xFFFF;
  // get number of templates in memory
  uint8_t packet[] = {FINGERPRINT_TEMPLATECOUNT};
  writePacket(theAddress, FINGERPRINT_COMMANDPACKET, sizeof(packet)+2, packet);
  uint8_t len = getReply(recvPacket);

  if ((len != 1) && (recvPacket[0] != FINGERPRINT_ACKPACKET))
   return -1;

  templateCount = recvPacket[2];
  templateCount <<= 8;
  templateCount |= recvPacket[3];

  return recvPacket[1];
}

void Adafruit_Fingerprint::writePacket(uint32_t addr, uint8_t packettype,
				       uint16_t len, uint8_t *packet) {
#ifdef FINGERPRINT_DEBUG
  Serial.print("---> 0x");
  Serial.print((uint8_t)(FINGERPRINT_STARTCODE >> 8), HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)FINGERPRINT_STARTCODE, HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)(addr >> 24), HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)(addr >> 16), HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)(addr >> 8), HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)(addr), HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)packettype, HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)(len >> 8), HEX);
  Serial.print(" 0x");
  Serial.print((uint8_t)(len), HEX);
#endif

#if ARDUINO >= 100
  // write first 9 bytes
  mySerial->write((uint8_t)(FINGERPRINT_STARTCODE >> 8));
  mySerial->write((uint8_t)FINGERPRINT_STARTCODE);
  mySerial->write((uint8_t)(addr >> 24));
  mySerial->write((uint8_t)(addr >> 16));
  mySerial->write((uint8_t)(addr >> 8));
  mySerial->write((uint8_t)(addr));
  mySerial->write((uint8_t)packettype);
  mySerial->write((uint8_t)(len >> 8));
  mySerial->write((uint8_t)(len));
  // Serial.println(F("wrote first 9 bytes"));
#else
  mySerial->print((uint8_t)(FINGERPRINT_STARTCODE >> 8), BYTE);
  mySerial->print((uint8_t)FINGERPRINT_STARTCODE, BYTE);
  mySerial->print((uint8_t)(addr >> 24), BYTE);
  mySerial->print((uint8_t)(addr >> 16), BYTE);
  mySerial->print((uint8_t)(addr >> 8), BYTE);
  mySerial->print((uint8_t)(addr), BYTE);
  mySerial->print((uint8_t)packettype, BYTE);
  mySerial->print((uint8_t)(len >> 8), BYTE);
  mySerial->print((uint8_t)(len), BYTE);
#endif
  // get sum for package length and package identifier
  uint16_t sum = (len>>8) + (len&0xFF) + packettype;
  // Serial.println(F("sum for package length and package identifier added"));
  // change i from uint8_t to int to avoid overflow and infinite loop
  for (int i=0; i< len-2; i++) {
#if ARDUINO >= 100
    mySerial->write((uint8_t)(packet[i]));
#else
    mySerial->print((uint8_t)(packet[i]), BYTE);
#endif
#ifdef FINGERPRINT_DEBUG
    Serial.print(" 0x"); Serial.print(packet[i], HEX);
#endif
    sum += packet[i];
    // Serial.print(F("written packet ")); Serial.print(i+1); Serial.println(F(" bytes"));
  }
#ifdef FINGERPRINT_DEBUG
  //Serial.print("Checksum = 0x"); Serial.println(sum);
  Serial.print(" 0x"); Serial.print((uint8_t)(sum>>8), HEX);
  Serial.print(" 0x"); Serial.println((uint8_t)(sum), HEX);
#endif
#if ARDUINO >= 100
  // write the checksum bytes
  mySerial->write((uint8_t)(sum>>8));
  mySerial->write((uint8_t)sum);
#else
  mySerial->print((uint8_t)(sum>>8), BYTE);
  mySerial->print((uint8_t)sum, BYTE);
#endif
}


uint8_t Adafruit_Fingerprint::getReply(uint8_t packet[], uint16_t timeout) {
  uint8_t reply[20], idx;
  uint16_t timer=0;

  idx = 0;
#ifdef FINGERPRINT_DEBUG
  Serial.print("<--- ");
#endif
while (true) {
    while (!mySerial->available()) {
      delay(1);
      timer++;
      if (timer >= timeout) {
        // Serial.println(F("Timeout"));
        return FINGERPRINT_TIMEOUT;
      }
    }
    // something to read!
    reply[idx] = mySerial->read();
#ifdef FINGERPRINT_DEBUG
    Serial.print(" 0x"); Serial.print(reply[idx], HEX);
#endif
    if ((idx == 0) && (reply[0] != (FINGERPRINT_STARTCODE >> 8)))
      continue;
    idx++;

    // check packet!
    if (idx >= 9) {
      if ((reply[0] != (FINGERPRINT_STARTCODE >> 8)) ||
          (reply[1] != (FINGERPRINT_STARTCODE & 0xFF)))
          return FINGERPRINT_BADPACKET;
      uint8_t packettype = reply[6];
      //Serial.print("Packet type"); Serial.println(packettype);
      uint16_t len = reply[7];
      len <<= 8;
      len |= reply[8];
      len -= 2;
      //Serial.print("Packet len"); Serial.println(len);
      if (idx <= (len+10)) continue; // read the content
      packet[0] = packettype; // finished reading content
      for (uint8_t i=0; i<len; i++) { // put content into reply
        packet[1+i] = reply[9+i];
      }
#ifdef FINGERPRINT_DEBUG
      Serial.println();
#endif
      return len;
    }
  }
}
