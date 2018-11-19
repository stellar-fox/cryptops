# cryptops

Crypto building blocks.

[![GitHub top language](https://img.shields.io/github/languages/top/stellar-fox/cryptops.svg)](https://github.com/stellar-fox/cryptops)
[![GitHub code size](https://img.shields.io/github/languages/code-size/stellar-fox/cryptops.svg)](https://github.com/stellar-fox/cryptops)

<br />




## index

* [documentation](#documentation)
* [use the source](#use-the-source)
* [namespace](#namespace)
* [tests](#tests)
* [support](#support)
* [license](#license)

<br />




## documentation

> [API Reference](https://stellar-fox.github.io/cryptops/)

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
>   passphraseDecrypt: [Function: passphraseDecrypt] }
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
