/**
 * Converts data to and from a buffer to JSON data according to the config object
 * e.g.
 *
 * var config = {
 *     dfcg: {
 *         command: {
 *             name: 'DCFG',
 *             title: 'Device Configuration Message',
 *             description: 'Configures the device, only first transmitter can send',
 *             code: 0x12
 *         },
 *         fields: [
 *             {name: 'cat', type: 'int', length: 2},
 *             {name: 'dog', type: 'string', length: 12},
 *             {name: 'signals', type: 'int', length: 2, repeats: 6}
 *         ]
 *     }
 * };
 *
 * var message = {cat: 256, dog: 'You smell', signals: [2, 17, 257, 33, 1, 1000]}
 * var buffer = BufferManager.encode(config.dfcg, message);
 * var message2 = BufferManager.decode(config.dfcg, buffer);
 * assert(message == message2);
 */

var crc = require('crc');
var Buffer = require('buffer').Buffer;
var BufferManager = module.exports = {};

// 2 frame bytes are required at the start of each message
var frame = [0xAA, 0xBB];

// Encodes values
var encode = {
    int: function(buffer, offset, value, length) {
        if (length == 1) {
            buffer.writeUInt8(value, offset);
            return offset + 1;
        }
        if (length == 2) {
            buffer.writeUInt16BE(value, offset);
            return offset + 2;
        }
        if (length == 4) {
            buffer.writeUInt32BE(value, offset);
            return offset + 4;
        }

        throw 'Unsupported integer length '+length;
    },

    string: function(buffer, offset, value, length) {
        var blankCode = ' '.charCodeAt(0);
        for (var i = 0; i < length ; i++) {
            offset = encode.int(buffer, offset, value[i] ? value.charCodeAt(i) : blankCode, 1);
        }

        return offset;
    }
};

// Encodes values
var decode = {
    int: function(buffer, offset, data, key, length) {
        if (length == 1) {
            data[key] = buffer.readUInt8(offset);
            return offset + 1;
        }
        if (length == 2) {
            data[key] = buffer.readUInt16BE(offset);
            return offset + 2;
        }
        if (length == 4) {
            data[key] = buffer.readUInt32BE(offset);
            return offset + 4;
        }

        throw 'Unsupported integer length '+length;
    },

    string: function(buffer, offset, data, key, length) {
        var blankCode = ' '.charCodeAt(0);
        var string = [];
        for (var i = 0; i < length ; i++) {
            offset = decode.int(buffer, offset, string, i, 1);
        }
        data[key] = String.fromCharCode.apply(this, string).replace(/ +$/,'');
        return offset;
    }
};

BufferManager.encode = function(config, data) {

    // Compute buffer length
    var length = config.fields.reduce(function(a, b) {
        return a + b.length * (b.repeats || 1);
    }, 0);

    // Actual buffer length must include frame, command, length and CRC
    var buffer = new Buffer(6 + length);
    var offset = 0;

    // Add frame to the buffer
    offset = encode.int(buffer, offset, frame[0], 1);
    offset = encode.int(buffer, offset, frame[1], 1);
    offset = encode.int(buffer, offset, config.command.code, 1);
    offset = encode.int(buffer, offset, length, 1);

    // Encode values into the buffer
    config.fields.map(function(field) {
        if (field.repeats) {
            if (field.repeats !== data[field.name].length) {
                throw 'Field "'+field.name+'" must have '+field.repeats+' values';
            }

            for (var i = 0; i < field.repeats; i++) {
                offset = encode[field.type](buffer, offset, data[field.name][i], field.length);
            }
        }
        else offset = encode[field.type](buffer, offset, data[field.name], field.length);
    });

    // Find CRC
    encode.int(buffer, offset, crc.buffer.crc16(buffer.slice(2, offset)), 2);

    return buffer;
};

BufferManager.decode = function(config, buffer) {
    if (config.command.code != buffer.readUInt8(2)) return false;

    var data = {};
    var offset = 4;

    // Encode values into the buffer
    config.fields.map(function(field) {
        if (field.repeats) {
            var array = [];
            for (var i = 0; i < field.repeats; i++) {
                offset = decode[field.type](buffer, offset, array, i, field.length);
            }
            data[field.name] = array;
        }
        else offset = decode[field.type](buffer, offset, data, field.name, field.length);
    });

    // TODO: validate checksum here

    return data;
};
