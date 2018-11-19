/* global describe it */




var
    assert = require("assert"),
    {
        passphraseEncrypt,
        passphraseDecrypt,
    } = require("../lib/cryptops"),
    {
        codec,
        string,
        type,
    } = require("@xcmats/js-toolbox"),
    t = 20000




describe("passphrase encrypt/decrypt test", () => {

    var
        passphrase = string.random(32),
        stringContent = null,
        content = null,
        contentLength = 6*1024*1024,
        ciphertext = null, ciphertext2 = null,
        decryptedContent = null,
        decryptedContent2 = null,
        decryptedContent3 = null,
        decryptedContent4 = null


    it("should generate content", () => {
        stringContent = string.random(contentLength)
        content = codec.stringToBytes(stringContent)
        assert.equal(stringContent.length, contentLength)
        assert.equal(content.length, contentLength)
    }).timeout(t)


    it("should encrypt", async () => {
        try {
            ciphertext = await passphraseEncrypt(passphrase, content)
            ciphertext2 = await passphraseEncrypt(passphrase, content)
            assert.notEqual(ciphertext, null)
            assert.notEqual(ciphertext2, null)
            assert.ok(type.isString(ciphertext))
            assert.ok(type.isString(ciphertext2))
        } catch (ex) {
            assert.fail(ex)
        }
    }).timeout(t)


    it("should have different ciphertexts", async () => {
        try {
            assert.notEqual(ciphertext, ciphertext2)
            assert.notDeepEqual(ciphertext, ciphertext2)
        } catch (ex) {
            assert.fail(ex)
        }
    }).timeout(t)


    it("should decrypt", async () => {
        try {
            decryptedContent = await passphraseDecrypt(
                passphrase, ciphertext
            )
            decryptedContent2 = await passphraseDecrypt(
                passphrase, ciphertext
            )
            decryptedContent3 = await passphraseDecrypt(
                passphrase, ciphertext2
            )
            decryptedContent4 = await passphraseDecrypt(
                passphrase, ciphertext2
            )
            assert.notEqual(decryptedContent, null)
            assert.notEqual(decryptedContent2, null)
            assert.notEqual(decryptedContent3, null)
            assert.notEqual(decryptedContent4, null)
        } catch (ex) {
            assert.fail(ex)
        }
    }).timeout(t)


    it("should match content", () => {
        assert.deepEqual(content, decryptedContent)
        assert.deepEqual(content, decryptedContent2)
        assert.deepEqual(content, decryptedContent3)
        assert.deepEqual(content, decryptedContent4)
        assert.equal(
            stringContent,
            codec.bytesToString(decryptedContent)
        )
        assert.equal(
            stringContent,
            codec.bytesToString(decryptedContent2)
        )
        assert.equal(
            stringContent,
            codec.bytesToString(decryptedContent3)
        )
        assert.equal(
            stringContent,
            codec.bytesToString(decryptedContent4)
        )
    }).timeout(t)


    it("should not decrypt with a wrong passphrase", async () => {
        try {
            assert.equal(
                null,
                await passphraseDecrypt(
                    string.random(32),
                    ciphertext
                )
            )
            assert.equal(
                null,
                await passphraseDecrypt(
                    string.random(32),
                    ciphertext2
                )
            )
        } catch (ex) {
            assert.fail(ex)
        }
    }).timeout(t)

})
