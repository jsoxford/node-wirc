// Configuration for WIRC commands
module.exports = {
    broadcastDiscover: {
        command: {
            name: 'BCSD',
            description: 'Attempts to discover WIRC devices',
            code : 0x01
        },
        fields: [
            {name: 'deviceType', type: 'int'},
            {name: 'version', type: 'int', repeats: 2}
        ]
    },
    broadcastRespond: {
        command: {
            name: 'BCSA',
            description: 'Response from a discovery request',
            code : 0x02
        },
        fields: [
            {name: 'hardwareVersion', type: 'int', repeats: 2},
            {name: 'softwareVersion', type: 'int', repeats: 2},
            {name: 'deviceName', type: 'string', length: 64},
            {name: 'serialNumber', type: 'string', length: 7}
        ]
    },
    transmitterLogin: {
        command: {
            name: 'TL',
            description: 'Attempts to login to a device',
            code:  0x11
        },
        fields: [
            {name: 'deviceType', type: 'int'},
            {name: 'version', type: 'int', repeats: 2},
            {name: 'priority', type: 'int'},
            {name: 'transmitterName', type: 'string', length: 64},
            {name: 'statusPort', type: 'int', length: 2}
        ]
    },
    deviceConfig: {
        command: {
            name: 'DCFG',
            description: 'Renames a device, effective after restart',
            code:  0x12
        },
        fields: [
            {name: 'deviceName', type: 'string', length: 64},
            {name: 'unusedVoltages', type: 'null', length: 4}
        ]
    },
    channelConfig: {
        command: {
            name: 'CCFG',
            description: 'Sets the time period of the PCD channel pulses',
            code:  0x13
        },
        fields: [{name: 'timePeriods', type: 'int', length: 2, repeats: 12}]
    },
    failsafeConfig: {
        command: {
            name: 'FCFG',
            description: 'Sets failsafe values for the PCD channels',
            code:  0x14
        },
        fields: [{name: 'channelValues', type: 'int', length: 2, repeats: 12}]
    },
    loginComplete: {
        command: {
            name: 'WST',
            description: 'Response sent when transmitter has logged in successfullly',
            code : 0x1A
        },
        fields: [
            {name: 'id', type: 'int'},
            {name: 'cameraCount', type: 'int'},
            {name: 'controlPort', type: 'int', length: 2}
        ]
    },
    controlChannels: {
        command: {
            name: 'PCD',
            description: 'Controls WIRC device, setting channel values for the configured period',
            code:  0x21
        },
        fields: [{name: 'channelValues', type: 'int', length: 2, repeats: 12}]
    },
    statusMessage: {
        command: {
            name: 'PSD',
            description: 'Status messages sent to the transmitter',
            code : 0x22
        },
        fields: [
            {name: 'batteries', type: 'int', length: 2, repeats: 2},
            {name: 'digitalInputs', type: 'int', repeats: 4}
        ]
    },
    wifiConfig: {
        command: {
            name: 'WCFG',
            code:  0x31
        },
        fields: [
            {name: 'ssid', type: 'string', length: 32},
            {name: 'password', type: 'string', length: 64},
            {name: 'accessPoint', type: 'boolean'},
            {name: 'secured', type: 'boolean'},
            {name: 'channel', type: 'int'},
            {name: 'country', type: 'string', length: 2}
        ]
    },
    listTransmitters: {
        command: {
            name: 'TLR',
            description: 'Requests a list of connected transmitters',
            code : 0x32
        },
        fields: []
    },
    transmitterResponse: {
        command: {
            name: 'TLST',
            description: 'Response giving details about a transmitter',
            code:  0x33
        },
        fields: [
            {name: 'id', type: 'int'},
            {name: 'priority', type: 'int'},
            {name: 'transmitterName', type: 'string', length: 64}
        ]
    },
    transmitterResponseEnd: {
        command: {
            name: 'TLEND',
            description: 'Response indicating end of list of transmitters',
            code : 0x34
        },
        fields: []
    },
    error: {
        command: {
            name: 'ERR',
            description: 'Response when an invalid command was sent',
            code : 0xFF
        },
        fields: [
            {name: 'commandCode', type: 'int'},
            {name: 'errorCode', type: 'int', length: 2}
        ]
    },
    AREQ: {
        command: {
            name: 'AREQ',
            code : 0x35
        },
        fields: []
    },
    AGR: {
        command: {
            name: 'AGR',
            code:  0x36
        },
        fields: []
    },
    FWUP: {
        command: {
            name: 'FWUP',
            code:  0x37
        },
        fields: []
    },
    startCameraStream: {
        command: {
            name: 'STST',
            code : 0x41
        },
        fields: [
            {name: 'id', type: 'int'},
            {name: 'cameraPort', type: 'int', length: 2}
        ]
    },
    jpegStream: {
        fields: [
            {name: 'lastPacket', type: 'int', length: 2},
            {name: 'protocolVersion', type: 'null', length: 2},
            {name: 'frameIndex', type: 'int', length: 4},
            {name: 'packetIndex', type: 'int', length: 4},
            {name: 'length', type: 'int', length: 4}
        ]
    },
    EST: {
        command: {
            name: 'EST',
            code: 0x42
        },
        fields: []
    }
};
