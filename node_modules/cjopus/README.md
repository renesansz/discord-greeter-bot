# CJOpus
Emscripten (C++/JavaScript) bindings for libopus

A module to encode PCM data to and decode PCM data from Opus.

## Using

The `lib` folder includes a pre-compiled version. Requiring the `Opus.js` entrypoint file should be enough.

### OpusEncoder

```js
//Tries to mimic `node-opus` in syntax.
var encoder = new OpusEncoder( 48000, 2 );
```

### OpusEncoder#encode(Buffer/TypedArray/Array)

```js
var PCM = getPCMDataSomehow();
var encoded = encoder.encode( PCM );
```

### OpusEncoder#decode(Buffer/TypedArray/Array)

```js
var OPUS = getOPUSDataSomehow();
var decoded = encoder.decode( OPUS );
```

### OpusEncoder#encodeUnsafe / OpusEncoder#decodeUnsafe

These two methods work just like the safe versions, however they don't do any error checking and they use `.subarray()` instead of `.slice()`. Because of this, it's a bit faster. It's relatively safe to use, just know that if an encoding error happens, it will return an empty `Uint8Array` (encode) or `Int16Array` (decode).

### OpusEncoder#destroy()

```js
encoder.destroy();
```

Since this is an Emscripten module (that also has to malloc), the memory also needs to be freed manually when finished. It's a small program, perhaps under 30KB of dynamically allocated memory, but that can add up.

## Building

The required packages for building (under Debian-based distros) are:

* git
* build-essential
* libtool

```bash
$ git clone --recursive https://github.com/izy521/CJOpus.git
$ cd CJOpus
$ make
```