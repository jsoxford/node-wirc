/**
 * Encodes and decodes commands
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
 * var buffer = CommandManager.encode(config.dfcg, message);
 * var message2 = CommandManager.decode(config.dfcg, buffer);
 * assert(message == message2);
 */

module.exports = function(commands) {

    var crc = require('crc');
    var fs = require('fs');
    var Buffer = require('buffer').Buffer;
    var CommandManager = {commands: commands};

    // 2 frame bytes are required at the start of each message
    var frame = [0xAA, 0xBB];

    // Finds a command from its code
    var findCommand = function(code) {
        for (i in CommandManager.commands) {
            if (CommandManager.commands[i].command.code == code) {
                return i;
            }
        }
    };

    // Encodes values
    var encoders = {
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
            for (var i = 0; i < length ; i++) {
                offset = encoders.int(buffer, offset, value[i] ? value.charCodeAt(i) : 0, 1);
            }

            return offset;
        },

        null: function(buffer, offset, value, length) {
            for (var i = 0; i < length ; i++) {
                offset = encoders.int(buffer, offset, 0, 1);
            }
            return offset;
        },

        boolean: function(buffer, offset, value, length) {
            return encoders.int(buffer, offset, value ? 1 : 0, 1);
        }
    };

    // Encodes values
    var decoders = {
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
                offset = decoders.int(buffer, offset, string, i, 1);
            }
            data[key] = String.fromCharCode.apply(this, string).replace(/\u0000.*$/g, "");
            return offset;
        },

        null: function(buffer, offset, data, key, length) {
            return offset + length;
        },

        boolean: function(buffer, offset, data, key, length) {
            offset = decoders.int(buffer, offset, data, key, 1);
            data[key] = data[key] == 1;
            return offset;
        }
    };

    CommandManager.encode = function(command, data) {

        var config = CommandManager.commands[command];
        if (!config) throw 'Unknown command "'+command+'" to encode';

        // Compute buffer length
        var length = config.fields.reduce(function(a, b) {
            return a + (b.length || 1) * (b.repeats || 1);
        }, 0);

        // Actual buffer length must include frame, command, length and CRC
        var buffer = new Buffer(6 + length);
        var offset = 0;

        // Add frame to the buffer
        offset = encoders.int(buffer, offset, frame[0], 1);
        offset = encoders.int(buffer, offset, frame[1], 1);
        offset = encoders.int(buffer, offset, config.command.code, 1);
        offset = encoders.int(buffer, offset, length, 1);

        // Encode values into the buffer
        config.fields.map(function(field) {
            if (!encoders[field.type]) throw 'Unknown encoder "'+field.type+'"';

            if (field.repeats) {
                if (field.repeats !== data[field.name].length) {
                    throw 'Field "'+field.name+'" must have '+field.repeats+' values';
                }

                for (var i = 0; i < field.repeats; i++) {
                    offset = encoders[field.type](buffer, offset, data[field.name][i], field.length || 1);
                }
            }
            else offset = encoders[field.type](buffer, offset, data[field.name], field.length || 1);
        });

        // Find CRC
        encoders.int(buffer, offset, crc.buffer.crc16(buffer.slice(2, offset)), 2);

        return buffer;
    };

    CommandManager.decode = function(buffer) {

        var code = buffer.readUInt8(2);
        var command = findCommand(code);
        var config = CommandManager.commands[command];
        if (!config) throw 'Unknown command code "'+code+'" to decode';

        var data = {command: command};
        var offset = 4;

        // Encode values into the buffer
        config.fields.map(function(field) {
            if (!encoders[field.type]) throw 'Unknown decoder "'+field.type+'"';

            if (field.repeats) {
                var array = [];
                for (var i = 0; i < field.repeats; i++) {
                    offset = decoders[field.type](buffer, offset, array, i, field.length || 1);
                }
                data[field.name] = array;
            }
            else offset = decoders[field.type](buffer, offset, data, field.name, field.length || 1);
        });

        // TODO: validate checksum here

        return data;
    };

    CommandManager.decodeJpeg = function(buffer) {
        var config = CommandManager.commands.jpegStream;
        var data = {};
        var offset = 0;

        // Encode values into the buffer
        config.fields.map(function(field) {
            if (!encoders[field.type]) throw 'Unknown decoder "'+field.type+'"';

            if (field.repeats) {
                var array = [];
                for (var i = 0; i < field.repeats; i++) {
                    offset = decoders[field.type](buffer, offset, array, i, field.length || 1);
                }
                data[field.name] = array;
            }
            else offset = decoders[field.type](buffer, offset, data, field.name, field.length || 1);
        });

        // TODO: This only supports one packet per frame
        data.image = buffer.slice(16);

        return data;

    };

    return CommandManager;
};
