/**
 * ------------------------------------------------------------------
 * AES
 * ------------------------------------------------------------------
 *
 * AES-256-GCM implementation used by every Petoman client.
 *
 * Responsibilities
 * ----------------
 * ✔ Encrypt binary data
 * ✔ Encrypt UTF-8 text
 * ✔ Decrypt binary data
 * ✔ Decrypt UTF-8 text
 * ✔ AAD support
 * ✔ CryptoEnvelope generation
 *
 * This module NEVER derives keys.
 *
 * ------------------------------------------------------------------
 */

import {
    CryptoAlgorithm,
} from '../enums';

import type {
    CryptoEnvelope,
} from '../interfaces';

import {
    CRYPTO_CONSTANTS,
} from '../constants';

import {
    generateIV,
} from '../utils';

import {
    validateAESKey,
    validateIV,
    validateAuthTag,
} from '../utils';

import {
    utf8ToBytes,
    bytesToUtf8,
} from '../utils';

import {
    toBase64Url,
    fromBase64Url,
} from '../utils';

import {
    toArrayBuffer,
} from '../utils';


export class AES {


    // -------------------------------------------------------------
    // Encrypt Bytes
    // -------------------------------------------------------------

    static async encrypt(

        data: Uint8Array,

        key: Uint8Array,

        keyVersion: number,

        aad?: Uint8Array,

        encoding:
            'binary' | 'utf8'
            =
            'binary',

    ): Promise<CryptoEnvelope> {


        validateAESKey(
            key,
        );


        const iv =
            generateIV();


        validateIV(
            iv,
        );


        const cryptoKey =
            await crypto.subtle.importKey(

                'raw',

                toArrayBuffer(
                    key
                ),

                {
                    name:
                        'AES-GCM',
                },

                false,

                [
                    'encrypt',
                ],

            );


        const algorithm: AesGcmParams = {

            name:
                'AES-GCM',

            iv:
                toArrayBuffer(
                    iv,
                ),

            tagLength:
                CRYPTO_CONSTANTS
                    .GCM_TAG_LENGTH
                *
                8,

        };


        if (aad) {

            algorithm.additionalData =
                toArrayBuffer(
                    aad,
                );

        }


        const cipher =
            await crypto.subtle.encrypt(

                algorithm,

                cryptoKey,

                toArrayBuffer(
                    data,
                ),

            );


        const encrypted =
            new Uint8Array(
                cipher,
            );


        const authTag =
            encrypted.slice(
                encrypted.length - 16,
            );


        const cipherText =
            encrypted.slice(
                0,
                encrypted.length - 16,
            );


        validateAuthTag(
            authTag,
        );


        return {


            cryptoVersion:
            CRYPTO_CONSTANTS
                .CRYPTO_VERSION,


            algorithm:
            CryptoAlgorithm
                .AES_256_GCM,


            keyVersion,


            cipherText:
                toBase64Url(
                    cipherText,
                ),


            iv:
                toBase64Url(
                    iv,
                ),


            authTag:
                toBase64Url(
                    authTag,
                ),


            ...(aad
                ? {
                    aad:
                        toBase64Url(
                            aad,
                        ),
                }
                :
                {}),


            encoding,


        };


    }



    // -------------------------------------------------------------
    // Encrypt Text
    // -------------------------------------------------------------

    static encryptText(

        text: string,

        key: Uint8Array,

        keyVersion: number,

        aad?: Uint8Array,

    ) {


        return this.encrypt(

            utf8ToBytes(
                text,
            ),

            key,

            keyVersion,

            aad,

            'utf8',

        );


    }



    // -------------------------------------------------------------
    // Decrypt Bytes
    // -------------------------------------------------------------

    static async decrypt(

        envelope: CryptoEnvelope,

        key: Uint8Array,

        aad?: Uint8Array,

    ): Promise<Uint8Array> {


        validateAESKey(
            key,
        );


        const iv =
            fromBase64Url(
                envelope.iv,
            );


        const authTag =
            fromBase64Url(
                envelope.authTag,
            );


        const cipher =
            fromBase64Url(
                envelope.cipherText,
            );


        validateIV(
            iv,
        );


        validateAuthTag(
            authTag,
        );



        const encrypted =
            new Uint8Array(

                cipher.length
                +
                authTag.length,

            );


        encrypted.set(
            cipher,
        );


        encrypted.set(

            authTag,

            cipher.length,

        );



        const cryptoKey =
            await crypto.subtle.importKey(

                'raw',

                toArrayBuffer(
                    key
                ),

                {
                    name:
                        'AES-GCM',
                },

                false,

                [
                    'decrypt',
                ],

            );



        const algorithm: AesGcmParams = {


            name:
                'AES-GCM',


            iv:
                toArrayBuffer(
                    iv,
                ),


            tagLength:
                128,


        };



        const aadData =
            aad
            ??
            (
                envelope.aad
                    ?
                    fromBase64Url(
                        envelope.aad,
                    )
                    :
                    undefined
            );



        if (aadData) {

            algorithm.additionalData =
                toArrayBuffer(
                    aadData,
                );

        }



        const plain =
            await crypto.subtle.decrypt(

                algorithm,

                cryptoKey,

                toArrayBuffer(
                    encrypted,
                ),

            );



        return new Uint8Array(
            plain,
        );


    }




    // -------------------------------------------------------------
    // Decrypt Text
    // -------------------------------------------------------------

    static async decryptText(

        envelope: CryptoEnvelope,

        key: Uint8Array,

        aad?: Uint8Array,

    ): Promise<string> {


        const data =
            await this.decrypt(

                envelope,

                key,

                aad,

            );


        return bytesToUtf8(
            data,
        );


    }


}