/**
 * ------------------------------------------------------------------
 * Messaging Protocol
 * ------------------------------------------------------------------
 *
 * End-to-End encrypted messaging.
 *
 * Responsibilities
 * ----------------
 * ✔ Encrypt text messages
 * ✔ Encrypt binary payloads
 * ✔ Decrypt messages
 * ✔ Build transport payload
 * ✔ Support Additional Authenticated Data (AAD)
 *
 * Backend stores ONLY:
 *  - CipherText
 *  - IV
 *  - AuthTag
 *  - Metadata
 *
 * Backend NEVER decrypts messages.
 *
 * ------------------------------------------------------------------
 */

import { AES } from '../crypto';

import { CryptoAlgorithm } from '../enums';

import { CRYPTO_CONSTANTS } from '../constants';

import { type CryptoEnvelope } from '../interfaces';

export interface MessageTransport {

    /**
     * Unique message identifier.
     */
    messageId: string;

    /**
     * Consultation identifier.
     */
    consultationId: string;

    /**
     * Sender device identifier.
     */
    senderDeviceId: string;

    /**
     * Session key version.
     */
    sessionVersion: number;

    /**
     * Crypto protocol version.
     */
    cryptoVersion: number;

    /**
     * Encryption algorithm.
     */
    algorithm: CryptoAlgorithm;

    /**
     * Encrypted payload.
     */
    payload: CryptoEnvelope;

    /**
     * Creation timestamp.
     */
    createdAt: string;

}

export class MessagingProtocol {

    // -------------------------------------------------------------
    // Encrypt Text
    // -------------------------------------------------------------

    static async encryptText(

        consultationId: string,

        senderDeviceId: string,

        sessionKey: Uint8Array,

        sessionVersion: number,

        text: string,

        aad?: Uint8Array,

    ): Promise<MessageTransport> {

        const payload =
            await AES.encryptText(

                text,

                sessionKey,

                sessionVersion,

                aad,

            );

        return {

            messageId:
                crypto.randomUUID(),

            consultationId,

            senderDeviceId,

            sessionVersion,

            cryptoVersion:
                CRYPTO_CONSTANTS.CRYPTO_VERSION,

            algorithm:
                CryptoAlgorithm.AES_256_GCM,

            payload,

            createdAt:
                new Date().toISOString(),

        };

    }

    // -------------------------------------------------------------
    // Encrypt Binary
    // -------------------------------------------------------------

    static async encryptBinary(

        consultationId: string,

        senderDeviceId: string,

        sessionKey: Uint8Array,

        sessionVersion: number,

        data: Uint8Array,

        aad?: Uint8Array,

    ): Promise<MessageTransport> {

        const payload =
            await AES.encrypt(

                data,

                sessionKey,

                sessionVersion,

                aad,

            );

        return {

            messageId:
                crypto.randomUUID(),

            consultationId,

            senderDeviceId,

            sessionVersion,

            cryptoVersion:
                CRYPTO_CONSTANTS.CRYPTO_VERSION,

            algorithm:
                CryptoAlgorithm.AES_256_GCM,

            payload,

            createdAt:
                new Date().toISOString(),

        };

    }

    // -------------------------------------------------------------
    // Decrypt Text
    // -------------------------------------------------------------

    static async decryptText(

        payload: CryptoEnvelope,

        sessionKey: Uint8Array,

        aad?: Uint8Array,

    ): Promise<string> {

        return AES.decryptText(

            payload,

            sessionKey,

            aad,

        );

    }

    // -------------------------------------------------------------
    // Decrypt Binary
    // -------------------------------------------------------------

    static async decryptBinary(

        payload: CryptoEnvelope,

        sessionKey: Uint8Array,

        aad?: Uint8Array,

    ): Promise<Uint8Array> {

        return AES.decrypt(

            payload,

            sessionKey,

            aad,

        );

    }

}


