node-wirc
=========

## Intro

Node module for communicating with WiRC from Denison. The test device is their Smartracer.

http://wirc.dension.com/

This is is no way affiliated with Denison.

## Getting started

To get started install node, then run `npm install` and try running one of the example apps, for example:

    node examples/browserStream.js

This example connects to a car (you'll need to enter your car's serial number) and streams its camera data to a server at `http://localhost:8000/`.

Another good example is:

    node examples/doALittleDance.js

This drives the car around a bit using setInterval to change the inputs.

## Starting to code

The core library is pretty small so please have a look around and ask us about it!

We're sorry it may not all work as expected, its been a busy few months, please be patient and help us make it better!

## Known bugs and issues

- When you first start up the car, the client doesn't connect correctly :S, you have to run it twice to connect correctly

-----------

MIT - see LICENSE.md
