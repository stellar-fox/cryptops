/**
 * Crypto building blocks.
 *
 * @module @stellar-fox/cryptops
 * @license Apache-2.0
 */




import {
    array,
    codec,
    func,
    string,
    type,
    utils,
} from "@xcmats/js-toolbox"
import {
    createCipheriv,
    createDecipheriv,
} from "crypto-browserify"
import scrypt from "scrypt-js"
import {
    codec as sjclCodec,
    hash as sjclHash,
    misc as sjclMisc,
} from "sjcl"
import {
    hash as naclHash,
    randomBytes as naclRandomBytes,
    secretbox as naclSecretbox,
} from "tweetnacl"




/**
 * Retrieve 'n' random bytes from CSPRNG pool.
 * Alias for `tweetnacl.randomBytes()`.
 *
 * @function random
 * @see {@link https://bit.ly/tweetnaclrandom}
 * @param {Number} n
 * @returns {Uint8Array}
 */
export const random = naclRandomBytes




/**
 * Compute a `sha256` hash from a given input.
 * Uses `bitwiseshiftleft/sjcl`'s `sha256` implementation.
 *
 * @function sha256
 * @see {@link https://bit.ly/sjclsha256}
 * @see {@link https://bit.ly/toolboxcodec}
 * @see {@link https://bit.ly/toolboxfunc}
 * @param {Uint8Array} input
 * @returns {Uint8Array}
 */
export const sha256 = func.flow(
    codec.bytesToHex,
    sjclCodec.hex.toBits,
    sjclHash.sha256.hash,
    sjclCodec.hex.fromBits,
    codec.hexToBytes,
)




/**
 * Generate 32-byte value. Can be used as salt.
 *
 * @function salt32
 * @returns {Uint8Array}
 */
export const salt32 = () => func.compose(sha256, random)(128)




/**
 * Password-based key-derivation.
 * Uses `pbkdf2` implemented in `bitwiseshiftleft/sjcl`.
 *
 * @function genKey
 * @see {@link https://bit.ly/sjclpbkdf2}
 * @see {@link https://bit.ly/toolboxcodec}
 * @see {@link https://bit.ly/toolboxfunc}
 * @param {Uint8Array} [pass=Uint8Array.from([])] A password to derive key.
 * @param {Uint8Array} [salt=(new Uint8Array(32)).fill(0)]
 * @param {Number} [count=2**12] Difficulty.
 * @returns {Uint8Array}
 */
export const genKey = (
    pass = Uint8Array.from([]),
    salt = (new Uint8Array(32)).fill(0),
    count = 2**12
) =>
    func.pipe(
        sjclMisc.pbkdf2(
            func.compose(sjclCodec.hex.toBits, codec.bytesToHex)(pass),
            func.compose(sjclCodec.hex.toBits, codec.bytesToHex)(salt),
            count
        )
    )(
        sjclCodec.hex.fromBits,
        codec.hexToBytes
    )




/**
 * Compute a `sha512` hash from a given input.
 * Uses `dchest/tweetnacl-js`'s `sha512` implementation.
 *
 * @function sha512
 * @see {@link https://bit.ly/tweetnaclhash}
 * @param {Uint8Array} input
 * @returns {Uint8Array}
 */
export const sha512 = naclHash




/**
 * Generate 64-byte value. Can be used as salt.
 *
 * @function salt64
 * @returns {Uint8Array}
 */
export const salt64 = () => func.compose(sha512, random)(256)




/**
 * Key derivation options object type definition.
 *
 * @typedef {Object} KeyDerivationOptions
 * @property {Number} [count=2**12] Difficulty (CPU/memory cost)
 * @property {Number} [blockSize=8] The block size
 * @property {Number} [parallelization=1] Parallelization cost
 * @property {Number} [derivedKeySize=64] Derived key size in bytes
 * @property {Function} [progressCallback=()=>false]
 */




/**
 * Default values for KeyDerivationOptions.
 *
 * @private
 * @constant {KeyDerivationOptions} defKDO
 */
const defKDO = Object.freeze({
    count: 2**16,        // `N` - the CPU/memory cost
    blockSize: 8,        // `r` - the block size
    parallelization: 1,  // `p` - parallelization cost
    derivedKeySize: 64,  // derived key size in bytes
    progressCallback: (_p) => false,
})




/**
 * Password-based key-derivation.
 * Uses `scrypt` implemented in `ricmoo/scrypt-js`.
 *
 * @async
 * @function deriveKey
 * @see {@link https://bit.ly/scryptjs}
 * @param {Uint8Array} [pass=Uint8Array.from([])] A password to derive key.
 * @param {Uint8Array} [salt=(new Uint8Array(32)).fill(0)]
 * @param {KeyDerivationOptions} [opts={}] @see KeyDerivationOptions
 * @returns {Promise.<Uint8Array>}
 */
export const deriveKey = (
    pass = Uint8Array.from([]),
    salt = (new Uint8Array(64)).fill(0),
    {
        count = defKDO.count,
        blockSize = defKDO.blockSize,
        parallelization = defKDO.parallelization,
        derivedKeySize = defKDO.derivedKeySize,
        progressCallback = defKDO.progressCallback,
    } = {}
) =>
    new Promise(
        (resolve, reject) =>
            scrypt(
                pass, salt,
                count, blockSize, parallelization, derivedKeySize,
                (error, progress, key) => {
                    if (error) return reject(error)
                    if (key) return resolve(Uint8Array.from(key))
                    if (progress) return progressCallback(progress)
                    return false
                }
            )
    )




/**
 * Generate 48 bits (6 bytes) timestamp - milliseconds since epoch.
 *
 * @function timestamp
 * @returns {Uint8Array}
 */
export const timestamp = () =>
    func.pipe(Date.now())(
        (d) => d.toString(16),
        func.rearg(string.padLeft)(1, 2, 0)(6*2, "0"),
        codec.hexToBytes
    )




/**
 * Generate 128 bits UUID. Comprised of:
 * - 48 bits of milliseconds since epoch
 * - 32 bits of truncated `sha256` sum of userAgent string
 * - 48 random bits
 *
 * @function genUUID
 * @returns {Uint8Array}
 */
export const genUUID = () => codec.concatBytes(

    // 48 bits (6 bytes): timestamp - milliseconds since epoch
    timestamp(),

    // 32 bits (4 bytes): truncated `sha256` sum of userAgent string
    func.pipe(
        utils.handleException(
            () => utils.isBrowser() ?
                navigator.userAgent :
                "non-browser-env",
            () => "unknown-env"
        )
    )(
        codec.stringToBytes,
        sha256,
        (b) => Array.from(b),
        array.takeEvery(8),
        (a) => Uint8Array.from(a)
    ),

    // 48 random bits (6 bytes)
    random(6)

)




/**
 * Extract `timestamp`, `user agent id` and `random` component
 * from given `uuid`, which was generated using `genUUID()`.
 *
 * @function decodeUUID
 * @param {Uint8Array} uuid
 * @returns {Object}
 */
export const decodeUUID = (uuid) => ({
    timestamp: func.pipe(uuid)(
        array.take(6),
        codec.bytesToHex,
        func.rearg(parseInt)(1, 0)(16),
        (ms) => new Date(ms)
    ),
    uaId: func.pipe(uuid)(
        array.drop(6),
        array.take(4),
        codec.bytesToHex
    ),
    rnd: func.pipe(uuid)(
        array.drop(10),
        array.take(6),
        codec.bytesToHex
    ),
})




/**
 * Generate nonce suitable to use with salsaEncrypt/salsaDecrypt functions.
 *
 * @function salsaNonce
 * @returns {Uint8Array}
 */
export const salsaNonce = () => codec.concatBytes(
    timestamp(),
    random(naclSecretbox.nonceLength - 6)
)




/**
 * Symmetric `xsalsa20-poly1305` encryption.
 * Uses `dchest/tweetnacl-js` implementation.
 *
 * @function salsaEncrypt
 * @see {@link https://bit.ly/tweetnaclsalsa}
 * @param {Uint8Array} key Encryption key.
 * @param {Uint8Array} message A content to encrypt.
 * @returns {Uint8Array} Initialization Vector concatenated with Ciphertext.
 */
export const salsaEncrypt = func.curry((key, message) => (
    (iv) => codec.concatBytes(iv, naclSecretbox(message, iv, key))
)(salsaNonce()))




/**
 * Symmetric `xsalsa20-poly1305` decryption.
 * Uses `dchest/tweetnacl-js` implementation.
 *
 * @function salsaDecrypt
 * @see {@link https://bit.ly/tweetnaclsalsa}
 * @param {Uint8Array} key Decryption key.
 * @param {Uint8Array} ciphertext A content to decrypt.
 * @returns {(Uint8Array|null)} Decrypted message or null.
 */
export const salsaDecrypt = func.curry((key, ciphertext) =>
    naclSecretbox.open(
        array.drop(naclSecretbox.nonceLength)(ciphertext),
        array.take(naclSecretbox.nonceLength)(ciphertext),
        key
    )
)




/**
 * Generate nonce suitable to use with aesEncrypt/aesDecrypt functions.
 *
 * @function aesNonce
 * @returns {Uint8Array}
 */
export const aesNonce = () => random(16)




/**
 * Symmetric `aes256` encryption in counter mode (CTR).
 * Uses `crypto-browserify` implementation.
 *
 * @function aesEncrypt
 * @see {@link https://bit.ly/npmcryptobrowserify}
 * @see {@link https://bit.ly/createcipheriv}
 * @param {Uint8Array} key Encryption key.
 * @param {Uint8Array} message A content to encrypt.
 * @returns {Uint8Array} Initialization Vector concatenated with Ciphertext.
 */
export const aesEncrypt = func.curry((key, message) => {
    let iv = aesNonce(),
        cipher = createCipheriv("aes-256-ctr", key, iv)
    return codec.concatBytes(iv, cipher.update(message), cipher.final())
})




/**
 * Symmetric `aes256` decryption in counter mode (CTR).
 * Uses `crypto-browserify` implementation.
 *
 * @function aesDecrypt
 * @see {@link https://bit.ly/npmcryptobrowserify}
 * @see {@link https://bit.ly/createdecipheriv}
 * @param {Uint8Array} key Decryption key.
 * @param {Uint8Array} ciphertext A content to decrypt.
 * @returns {Uint8Array} Decrypted message.
 */
export const aesDecrypt = func.curry((key, ciphertext) => (
    (decipher) =>
        codec.concatBytes(
            decipher.update(array.drop(16)(ciphertext)),
            decipher.final()
        )
)(createDecipheriv("aes-256-ctr", key, array.take(16)(ciphertext))))




/**
 * Needed constant/headers for encrypt/decrypt functions.
 *
 * @private
 * @constant {Object} encdec
 */
const encdec = Object.freeze({
    MAGIC: "0xDAB0",
    VERSION: "0x0001",
})




/**
 * Double-cipher (`salsa`/`aes`) encryption with `poly1305` MAC.
 * Uses `dchest/tweetnacl-js` "secretbox" for `xsalsa20-poly1305`
 * and `crypto-browserify` for `aes-256-ctr` encryption.
 * Inspired by `keybase.io/triplesec`.
 *
 * Algorithm:
 *
 * 1. `salsaNonce` is created
 * 2. `message` is being encrypted with `xsalsa20`
 *     using first 32 bytes of `key` and `salsaNonce`
 *     producing `[salsaNonce + salsaCiphertext]`
 * 3. `aesNonce` is created
 * 4. `[salsaNonce + salsaCiphertext]` is being encrypted with `aes-256-ctr`
 *     using last 32 bytes of `key` and `aesNonce`
 *     producing `[aesNonce + aesCiphertext]`
 * 5. [`encdec.MAGIC` + `encdec.VERSION` + `aesNonce` + `aesCiphertext`]
 *    is returned as an `Uint8Array` result
 *
 * @function encrypt
 * @see {@link https://bit.ly/toolboxcodec}
 * @see {@link https://bit.ly/toolboxfunc}
 * @param {Uint8Array} key 512 bits (64 bytes) encryption key.
 * @param {Uint8Array} message A content to encrypt.
 * @returns {Uint8Array} [MAGIC] + [VERSION] + [AES IV] + [Ciphertext].
 */
export const encrypt = func.curry((key, message) => {
    if (
        !type.isNumber(key.BYTES_PER_ELEMENT)  ||
        !type.isNumber(message.BYTES_PER_ELEMENT)  ||
        key.BYTES_PER_ELEMENT !== 1  ||
        message.BYTES_PER_ELEMENT !== 1
    ) throw new TypeError("encrypt: Arguments must be of [Uint8Array] type.")

    if (key.length !== 64) throw new RangeError(
        "encrypt: Key must be 512 bits long."
    )

    return codec.concatBytes(
        codec.hexToBytes(encdec.MAGIC),
        codec.hexToBytes(encdec.VERSION),
        func.pipe(message)(
            func.partial(salsaEncrypt)(array.take(32)(key)),
            func.partial(aesEncrypt)(array.drop(32)(key))
        )
    )
})
Object.freeze(Object.assign(encrypt, encdec))




/**
 * Double-cipher (`aes`/`salsa`) decryption with `poly1305` MAC.
 * Uses `dchest/tweetnacl-js` "secretbox" for `xsalsa20-poly1305`
 * and `crypto-browserify` for `aes-256-ctr` decryption.
 * Inspired by `keybase.io/triplesec`.
 *
 * Algorithm:
 *
 * 1. [`encdec.MAGIC` + `encdec.VERSION`] part of `ciphertext` is checked
 * 2. `[salsaNonce + salsaCiphertext]` is being decrypted with `aes-256-ctr`
 *     using last 32 bytes of `key` and `aesNonce`
 *     from `[aesNonce + aesCiphertext]` part of `ciphertext`
 * 3. `message` is being decrypted with `xsalsa20`
 *     using first 32 bytes of `key` and `salsaNonce`
 *     from `[salsaNonce + salsaCiphertext]`
 * 4. If salsa-decryption succeeded then `message` is returned,
 *     otherwise `null`.
 *
 * @function decrypt
 * @see {@link https://bit.ly/toolboxcodec}
 * @see {@link https://bit.ly/toolboxfunc}
 * @param {Uint8Array} key 512 bits (64 bytes) decryption key.
 * @param {Uint8Array} ciphertext A content to decrypt.
 * @returns {Uint8Array|Null} byte representation
 *      of a decrypted content or `null` if decryption is not possible.
 */
export const decrypt = func.curry((key, ciphertext) => {
    if (
        !type.isNumber(key.BYTES_PER_ELEMENT)  ||
        !type.isNumber(ciphertext.BYTES_PER_ELEMENT)  ||
        key.BYTES_PER_ELEMENT !== 1  ||
        ciphertext.BYTES_PER_ELEMENT !== 1
    ) throw new TypeError("decrypt: Arguments must be of [Uint8Array] type.")

    if (key.length !== 64) throw new RangeError(
        "decrypt: Key must be 512 bits long."
    )

    if (!codec.compareBytes(
        codec.concatBytes(
            codec.hexToBytes(encdec.MAGIC),
            codec.hexToBytes(encdec.VERSION)
        ),
        array.take(4)(ciphertext)
    )) throw new Error("decrypt: Magic byte or version mismatch.")

    return func.pipe(array.drop(4)(ciphertext))(
        func.partial(aesDecrypt)(array.drop(32)(key)),
        func.partial(salsaDecrypt)(array.take(32)(key))
    )
})
Object.freeze(Object.assign(decrypt, encdec))




/**
 * Double-cipher scrypt-based key-from-passphrase-deriving encrypter.
 * A `passphrase` is normalized to Normalization Form Canonical Composition.
 * @see {@link http://bit.ly/wikiuniequ}
 *
 * @async
 * @function passphraseEncrypt
 * @param {String} passphrase A password to derive key from.
 * @param {Uint8Array} message A content to encrypt.
 * @param {Object} [opts={}] @see KeyDerivationOptions.
 *      `salt` can be passed here as an additional parameter.
 * @returns {Promise.<String>} base64-encoded ciphertext
 */
export const passphraseEncrypt = async (
    passphrase = string.empty(),
    message = Uint8Array.from([]),
    {
        salt = salt64(),
        count = defKDO.count,
        blockSize = defKDO.blockSize,
        parallelization = defKDO.parallelization,
        derivedKeySize = defKDO.derivedKeySize,
        progressCallback = defKDO.progressCallback,
    } = {}
) =>
    func.pipe(
        salt,
        encrypt(
            await deriveKey(
                func.pipe(passphrase)(
                    (p) => p.normalize("NFC"),
                    codec.stringToBytes
                ),
                salt,
                {
                    count, blockSize, parallelization,
                    derivedKeySize, progressCallback,
                }
            ),
            message
        )
    )(
        codec.concatBytes,
        codec.b64enc
    )




/**
 * Double-cipher scrypt-based key-from-passphrase-deriving decrypter.
 * A `passphrase` is normalized to Normalization Form Canonical Composition.
 * @see {@link http://bit.ly/wikiuniequ}
 *
 * @async
 * @function passphraseDecrypt
 * @param {String} passphrase A password to derive key from.
 * @param {String} ciphertext A base64-encoded content to decrypt.
 * @param {KeyDerivationOptions} [opts={}] @see KeyDerivationOptions.
 * @returns {Promise.<Uint8Array>|Promise.<Null>} byte representation
 *      of a decrypted content or `null` if decryption is not possible.
 */
export const passphraseDecrypt = (
    passphrase = string.empty(),
    ciphertext = string.empty(),
    {
        count = defKDO.count,
        blockSize = defKDO.blockSize,
        parallelization = defKDO.parallelization,
        derivedKeySize = defKDO.derivedKeySize,
        progressCallback = defKDO.progressCallback,
    } = {}
) => (
    async (cipherBytes) =>
        decrypt(
            await deriveKey(
                func.pipe(passphrase)(
                    (p) => p.normalize("NFC"),
                    codec.stringToBytes
                ),
                array.take(64)(cipherBytes),
                {
                    count, blockSize, parallelization,
                    derivedKeySize, progressCallback,
                }
            ),
            array.drop(64)(cipherBytes)
        )
)(codec.b64dec(ciphertext))




/**
 * Library version.
 *
 * @constant {String} version
 */
export { version } from "../package.json"
