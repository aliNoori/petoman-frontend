/**
 * ------------------------------------------------------------------
 * Attachments Protocol
 * ------------------------------------------------------------------
 *
 * End-to-End encrypted attachments.
 *
 * Responsibilities
 * ----------------
 * ✔ Derive attachment encryption key
 * ✔ Encrypt files
 * ✔ Decrypt files
 * ✔ Build upload payload
 *
 * Backend stores ONLY:
 *  - Encrypted file
 *  - IV
 *  - AuthTag
 *  - Metadata
 *
 * Backend NEVER decrypts attachments.
 *
 * ------------------------------------------------------------------
 */

import { AES } from '../crypto';

import { SessionKeyManager } from '../managers';

import { type CryptoEnvelope } from '../interfaces';

import { CryptoAlgorithm } from '../enums';

import { CRYPTO_CONSTANTS } from '../constants';

import {
    toBase64Url,
} from '../utils';

import {type EncryptedAttachment} from "../types";

export class AttachmentsProtocol {

    // -------------------------------------------------------------
    // Encrypt Attachment
    // -------------------------------------------------------------

    static async encrypt(

        consultationId: string,

        sessionVersion: number,

        senderDeviceId: string,

        sharedSecret: Uint8Array,

        file: Uint8Array,

        fileName: string,

        mimeType: string,

        aad?: Uint8Array,

    ): Promise<EncryptedAttachment> {

        const derived =
            SessionKeyManager.deriveAttachmentKey(

                sharedSecret,

                consultationId,

                sessionVersion,

            );

        const payload =
            await AES.encrypt(

                file,

                derived.key,

                sessionVersion,

                aad,

            );

        return {

            attachmentId:
                crypto.randomUUID(),

            consultationId,

            sessionVersion,

            senderDeviceId,

            fileName,

            mimeType,

            fileSize:
            file.length,

            algorithm:
            CryptoAlgorithm.AES_256_GCM,

            cryptoVersion:
            CRYPTO_CONSTANTS.CRYPTO_VERSION,

            payload,

            hkdfSalt:
                toBase64Url(
                    derived.salt,
                ),

            createdAt:
                new Date().toISOString(),

        };

    }

    // -------------------------------------------------------------
    // Decrypt Attachment
    // -------------------------------------------------------------

    static async decrypt(

        payload: CryptoEnvelope,

        attachmentKey: Uint8Array,

        aad?: Uint8Array,

    ): Promise<Uint8Array> {

        return AES.decrypt(

            payload,

            attachmentKey,

            aad,

        );

    }

}