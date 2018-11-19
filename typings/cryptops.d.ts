/**
 * Crypto building blocks.
 *
 * @module @stellar-fox/cryptops
 * @license Apache-2.0
 */




declare module "@stellar-fox/cryptops" {

    /**
     * Retrieve 'n' random bytes from CSPRNG pool.
     * Alias for `tweetnacl.randomBytes()`.
     */
    export function random (n: number): Uint8Array;




    /**
     * Compute a `sha256` hash from a given input.
     * Uses `bitwiseshiftleft/sjcl`'s `sha256` implementation.
     */
    export function sha256 (input: Uint8Array): Uint8Array;




    /**
     * Generate 32-byte value. Can be used as salt.
     */
    export function salt32 (): Uint8Array;




    /**
     * Password-based key-derivation.
     * Uses `pbkdf2` implemented in `bitwiseshiftleft/sjcl`.
     */
    export function genKey (
        pass: Uint8Array,
        salt: Uint8Array,
        count: number
    ): Uint8Array;




    /**
     * Compute a `sha512` hash from a given input.
     * Uses `dchest/tweetnacl-js`'s `sha512` implementation.
     */
    export function sha512 (input: Uint8Array): Uint8Array;




    /**
     * Generate 64-byte value. Can be used as salt.
     */
    export function salt64 (): Uint8Array;




    /**
     * Key derivation options object type definition.
     */
    export interface KeyDerivationOptions {
        count?: number;
        blockSize?: number;
        parallelization?: number;
        derivedKeySize?: number;
        progressCallback?: Function;
    }




    /**
     * Password-based key-derivation.
     * Uses `scrypt` implemented in `ricmoo/scrypt-js`.
     */
    export function deriveKey (
        pass: Uint8Array,
        salt: Uint8Array,
        opts?: KeyDerivationOptions
    ): Promise<Uint8Array>;




    /**
     * Generate 48 bits (6 bytes) timestamp - milliseconds since epoch.
     */
    export function timestamp (): Uint8Array;




    /**
     * Generate 128 bits UUID. Comprised of:
     * - 48 bits of miliseconds since epoch
     * - 32 bits of truncated `sha256` sum of userAgent string
     * - 48 random bits
     */
    export function genUUID (): Uint8Array;




    /**
     * Extract `timestamp`, `user agent id` and `random` component
     * from given `uuid`, which was generated using `genUUID()`.
     */
    export function decodeUUID (uuid: Uint8Array): object;




    /**
     * Generate nonce suitable to use with salsaEncrypt/salsaDecrypt functions.
     */
    export function salsaNonce (): Uint8Array;




    /**
     * Symmetric `xsalsa20-poly1305` encryption.
     * Uses `dchest/tweetnacl-js` implementation.
     */
    export function salsaEncrypt (
        key: Uint8Array,
        message: Uint8Array
    ): Uint8Array;




    /**
     * Symmetric `xsalsa20-poly1305` decryption.
     * Uses `dchest/tweetnacl-js` implementation.
     */
    export function salsaDecrypt (
        key: Uint8Array,
        ciphertext: Uint8Array
    ): Uint8Array | null;




    /**
     * Generate nonce suitable to use with aesEncrypt/aesDecrypt functions.
     */
    export function aesNonce (): Uint8Array;




    /**
     * Symmetric `aes256` encryption in counter mode (CTR).
     * Uses `crypto-browserify` implementation.
     */
    export function aesEncrypt (
        key: Uint8Array,
        message: Uint8Array
    ): Uint8Array;




    /**
     * Symmetric `aes256` decryption in counter mode (CTR).
     * Uses `crypto-browserify` implementation.
     */
    export function aesDecrypt (
        key: Uint8Array,
        ciphertext: Uint8Array
    ): Uint8Array;




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
     */
    export function encrypt (
        key: Uint8Array,
        message: Uint8Array
    ): Uint8Array;




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
     */
    export function decrypt (
        key: Uint8Array,
        ciphertext: Uint8Array
    ): Uint8Array | null;




    /**
     * Double-cipher scrypt-based key-from-passphrase-deriving encrypter.
     * A `passphrase` is normalized to Normalization Form Canonical Composition.
     */
    export function passphraseEncrypt (
        passphrase: string,
        message: Uint8Array,
        opts?: KeyDerivationOptions
    ): Promise<string>;




    /**
     * Double-cipher scrypt-based key-from-passphrase-deriving decrypter.
     * A `passphrase` is normalized to Normalization Form Canonical Composition.
     */
    export function passphraseDecrypt (
        passphrase: string,
        ciphertext: string,
        opts?: KeyDerivationOptions
    ): Promise<Uint8Array> | Promise<null>;




    /**
     * Library version.
     */
    export const version: string;

}
