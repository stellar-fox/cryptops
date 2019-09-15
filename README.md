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
* [play in your browser](#play-in-your-browser)
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




## play in your browser

> [RunKit with @stellar-fox/cryptops](https://npm.runkit.com/@stellar-fox/cryptops)


* encrypting text using a passphrase:

    https://runkit.com/xcmats/cryptops.passphraseencrypt


* decrypting text using a passphrase:

    https://runkit.com/xcmats/cryptops.passphrasedecrypt

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

Three builds are provided:

* [UMD][umdjs] (in `dist` directory)
* [CommonJS][commonjs] (in `lib` directory)
* [ES6][esmodules] (in `es` directory)

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
Hash: 2bdffa777f3a1b5775b0
Version: webpack 4.28.1
Time: 737ms
Built at: 2018-12-21 15:12:37
      Asset      Size  Chunks             Chunk Names
cryptops.js  24.9 KiB       0  [emitted]  cryptops
Entrypoint cryptops = cryptops.js
[0] external "@xcmats/js-toolbox" 42 bytes {0} [built]
[1] external "sjcl" 42 bytes {0} [built]
[2] external "tweetnacl" 42 bytes {0} [built]
[3] external "@babel/runtime/regenerator" 42 bytes {0} [built]
[4] external "@babel/.../asyncToGenerator" 42 bytes {0} [built]
[5] external "crypto-browserify" 42 bytes {0} [built]
[6] ./package.json 4.26 KiB {0} [built]
[7] external "scrypt-js" 42 bytes {0} [built]
[8] ./src/index.js 11.5 KiB {0} [built]
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
>   encrypt: { [Function: encrypt] },
>   decrypt: { [Function: decrypt] },
>   passphraseEncrypt: [Function: passphraseEncrypt],
>   passphraseDecrypt: [Function: passphraseDecrypt],
>   version: '1.0.5' }
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

You can support this project via [stellar][stellar] network:

* Payment address: [xcmats*keybase.io][xcmatspayment]
* Stellar account ID: [`GBYUN4PMACWBJ2CXVX2KID3WQOONPKZX2UL4J6ODMIRFCYOB3Z3C44UZ`][addressproof]


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
[umdjs]: https://github.com/umdjs/umd
[commonjs]: https://nodejs.org/docs/latest/api/modules.html#modules_modules
[esmodules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
[stellar]: https://learn.stellar.org
[xcmatspayment]: https://keybase.io/xcmats
[addressproof]: https://keybase.io/xcmats/sigchain#d0999a36b501c4818c15cf813f5a53da5bfe437875d92262be8d285bbb67614e22
