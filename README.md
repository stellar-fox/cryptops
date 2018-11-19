# cryptops

Crypto building blocks.

[![npm version](https://img.shields.io/npm/v/@stellar-fox/cryptops.svg)](https://www.npmjs.com/package/@stellar-fox/cryptops)
[![npm license](https://img.shields.io/npm/l/@stellar-fox/cryptops.svg)](https://www.npmjs.com/package/@stellar-fox/cryptops)
[![GitHub top language](https://img.shields.io/github/languages/top/stellar-fox/cryptops.svg)](https://github.com/stellar-fox/cryptops)
[![GitHub code size](https://img.shields.io/github/languages/code-size/stellar-fox/cryptops.svg)](https://github.com/stellar-fox/cryptops)
[![GitHub tag](https://img.shields.io/github/tag/stellar-fox/cryptops.svg)](https://github.com/stellar-fox/cryptops)

```bash
$ npm i @stellar-fox/cryptops
```

<br />




## index

* [foreword](#foreword)
* [documentation](#documentation)
* [use the package](#use-the-package)
    - [install](#install)
    - [play in node.js](#play-in-nodejs)
    - [example use in your code](#example-use-in-your-code)
* [use the source](#use-the-source)
* [namespace](#namespace)
* [tests](#tests)
* [support](#support)
* [license](#license)

<br />




## foreword

Cryptography is hard. Cryptography is important. Cryptography should be
more accessible.

This library aims to tackle the last of the above sencences - it provides
coherent API to use in browser as well as in server environment.

All the "heavy lifting" was done by the authors of the following,
magnificent projects:

* [Stanford Javascript Crypto Library][sjcl]
* [TweetNaCl.js][tweetnacl]
* [crypto-browserify][cryptobrowserify]
* [scrypt-js][scryptjs]

_cryptops_ just wraps and combines some of their parts without adding
anything that might lessen the security level.

Go ahead, [inspect the source][libsource] and see for yourself.

<br />




## documentation

> [API Reference](https://stellar-fox.github.io/cryptops/)

<br />




## use the package

### install

```bash
$ mkdir playground
$ cd playground/
$ npm init
...
$ npm i @stellar-fox/cryptops
...
```

<br />


### play in node.js

```bash
$ node
>
```

```javascript
cryptops = require("@stellar-fox/cryptops")
```

<br />


### example use in your code

For `utf8-string` <-> `bytes` <-> `hex-string` <-> `b64-string`
encoding and decoding [@xcmats/js-toolbox][js_toolbox] can
be used.

```javascript
import { passphraseEncrypt } from "@stellar-fox/cryptops"
import { newAddress } from "@stellar-fox/redshift"
import { codec } from "@xcmats/js-toolbox"

let
    myPassphrase = "H0cus P0cus Open Sesam3 4brakadabra",
    myPreciousSecret = newAddress().keypair.secret()

passphraseEncrypt(myPassphrase, codec.stringToBytes(myPreciousSecret))
    .then((ciphertext) => {
        console.log("Now I can sleep peacefully: ", ciphertext)
    })
```

<br />




## use the source

```bash
$ git clone git@github.com:stellar-fox/cryptops.git
Cloning into 'cryptops'...
$ cd cryptops
$ npm i
$ npm start
Compiling for 'production' ...
Hash: 8d52ae57748892e5a58f
Version: webpack 4.25.1
Time: 791ms
Built at: 2018-11-19 11:04:39
      Asset      Size  Chunks             Chunk Names
cryptops.js  24.2 KiB       0  [emitted]  cryptops
Entrypoint cryptops = cryptops.js
[0] external "@xcmats/js-toolbox" 42 bytes {0} [built]
[1] external "sjcl" 42 bytes {0} [built]
[2] external "tweetnacl" 42 bytes {0} [built]
[3] external "@babel/runtime/regenerator" 42 bytes {0} [built]
[4] external "@babel/runtime/helpers/asyncToGenerator" 42 bytes {0} [built]
[5] external "crypto-browserify" 42 bytes {0} [built]
[6] external "scrypt-js" 42 bytes {0} [built]
[7] ./src/index.js 11.4 KiB {0} [built]
```

<br />




## namespace

```javascript
cryptops
```

> ```javascript
> { random: [Function],
>   sha256: [Function],
>   salt32: [Function: salt32],
>   genKey: [Function: genKey],
>   sha512: { [Function] hashLength: 64 },
>   salt64: [Function: salt64],
>   deriveKey: [Function: deriveKey],
>   timestamp: [Function: timestamp],
>   genUUID: [Function: genUUID],
>   decodeUUID: [Function: decodeUUID],
>   salsaNonce: [Function: salsaNonce],
>   salsaEncrypt: [Function: salsaEncrypt],
>   salsaDecrypt: [Function: salsaDecrypt],
>   aesNonce: [Function: aesNonce],
>   aesEncrypt: [Function: aesEncrypt],
>   aesDecrypt: [Function: aesDecrypt],
>   encrypt: { [Function: encrypt] MAGIC: '0xDAB0', VERSION: '0x0001' },
>   decrypt: { [Function: decrypt] MAGIC: '0xDAB0', VERSION: '0x0001' },
>   passphraseEncrypt: [Function: passphraseEncrypt],
>   passphraseDecrypt: [Function: passphraseDecrypt],
>   version: '1.0.0' }
> ```

<br />




## tests

```bash
$ npm run test

  uuid test
    ✓ should generate uuid
    ✓ should decode uuid

  passphrase encrypt/decrypt test
    ✓ should generate content (5386ms)
    ✓ should encrypt (2407ms)
    ✓ should have different ciphertexts
    ✓ should decrypt (7258ms)
    ✓ should match content (67ms)
    ✓ should not decrypt with a wrong passphrase (2922ms)


  8 passing (18s)
```

<br />




## support

```
GAUWLOIHFR2E52DYNEYDO6ZADIDVWZKK3U77V7PMFBNOIOBNREQBHBRR
```

<br />




## license

**cryptops** are released under the Apache License, Version 2.0. See the
[LICENSE](https://github.com/stellar-fox/cryptops/blob/master/LICENSE)
for more details.




[js_toolbox]: https://www.npmjs.com/package/@xcmats/js-toolbox
[sjcl]: https://bitwiseshiftleft.github.io/sjcl/
[tweetnacl]: https://tweetnacl.js.org/
[cryptobrowserify]: https://github.com/crypto-browserify/crypto-browserify
[scryptjs]: https://github.com/ricmoo/scrypt-js
[libsource]: https://github.com/stellar-fox/cryptops/blob/master/src/index.js
