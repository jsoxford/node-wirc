
commands

All packets start with frame identifier, two bytes: 0xAA 0xBB

All packets end with crc16, two bytes. you can get this from the buffer
 var crc = require('crc');
 var msgCRC = crc.buffer.crc16(buf);
 console.log(msgCRC.toString(16));

---

BCSD - Broadcast Service Discovery ->
 UDP broadcast on 255.255.255.255 : 1984

 CMD     0x01
 LEN     0x03
 * systype 0x00 (PC)
 * v.major 0x00
 * v.minor 0x01


BCSA - Broadcast Service Advertisment <-
 UDP return to BCSD sender IP and originating (bound) port

 CMD     0x02
 LEN     0x4B - message length of 75
 * HW Version (2 bytes):
 * SW Version (2 bytes):
 * WRC Name (64 bytes):
 * Serial Number (7 bytes):

 Client should now store
     - IP
     - name
     - serial number
     - version numbers

---

TL - Transmitter Login ->
 TCP

 CMD     0x11
 LEN     0x46 - length 70
 * systype (1 byte)  0x00
 * v.major (1 byte)  0x00
 * v.minor (1 byte)  0x01
 * priority (1 byte) 0x00
 * transmitter name (64 bytes)
 * UDP port for PSD messages (2 bytes)

DCFG - Device Config -> (optional)


CCFG - Channel Config ->
FCFG - Failsafe Config ->
WST - WRCD Startup <-

---

PCD - Periodic Channel Data ->
PST - Periodic Status Data <-
