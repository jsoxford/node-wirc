node-wirc
=========

Node module for communicating with WiRC from Denison. Currently tested with their Smartracer RC car.

http://wirc.dension.com/

This is is no way affiliated with Denison.

## Getting started

To get started install node, then run `npm install` and try running one of the example apps.

To use any of the example apps you'll need to enter your car's serial number (which is a string, not a number!).

### Browser stream

    node examples/browserStream.js

This example connects to a car and streams its camera data to a server at `http://localhost:8000/`.

### Do-a-little-dance

Another good example is:

    node examples/doALittleDance.js

This drives the car around a bit using `setInterval` to change the inputs.

## Starting to code

The core library is pretty small so please have a look around and ask us about it!

Please ask us and we'll do our best to help you install supporting libraries like node, libkoki, npm, imagemagick (ad infinitum).

We're sorry it may not all work as expected, its been a busy few months, please be patient and help us make it better!

## Known bugs and issues

- When you first start up the car, the client doesn't connect correctly :S, you have to run it twice to connect correctly

-----------

MIT - see LICENSE.md
