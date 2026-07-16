/**
 * ------------------------------------------------------------------
 * Session Key Manager
 * ------------------------------------------------------------------
 *
 * Responsibilities
 * ----------------
 * ✔ Compute X25519 shared secret
 * ✔ Derive AES session keys
 * ✔ Rotate session keys
 * ✔ Derive attachment keys
 * ✔ Build encrypted session-key payload
 *
 * ------------------------------------------------------------------
 */

import { X25519 } from '../crypto';
import { HKDF } from '../crypto';

import { HKDF_INFO } from '../constants';

import {
    generateHKDFSalt,
} from '../utils';

import {
    toBase64Url,
} from '../utils';

import {
    validateSessionVersion,
} from '../utils';

import {
    type EncryptedSessionKey,
} from '../interfaces';

export interface DerivedKey {

    key: Uint8Array;

    salt: Uint8Array;

}

export class SessionKeyManager {

    // -------------------------------------------------------------
    // Shared Secret
    // -------------------------------------------------------------

    static createSharedSecret(
        privateKey: string,
        remotePublicKey: string,
    ): Uint8Array {

        return X25519.computeSharedSecret(

            X25519.importKey(privateKey),

            X25519.importKey(remotePublicKey),

        );

    }

    // -------------------------------------------------------------
    // Session Key
    // -------------------------------------------------------------

    static deriveSessionKey(

        sharedSecret: Uint8Array,

        consultationId: string,

        sessionVersion: number,

        deviceId: string,

        salt = generateHKDFSalt(),

    ): DerivedKey {

        validateSessionVersion(
            sessionVersion,
        );

        return {

            key: HKDF.deriveSessionKey(

                sharedSecret,

                salt,

                consultationId,

                sessionVersion,

                deviceId,

            ),

            salt,

        };

    }

    // -------------------------------------------------------------
    // Rotate
    // -------------------------------------------------------------

    static rotateSessionKey(

        sharedSecret: Uint8Array,

        consultationId: string,

        currentVersion: number,

        deviceId: string,

    ): DerivedKey {

        return this.deriveSessionKey(

            sharedSecret,

            consultationId,

            currentVersion + 1,

            deviceId,

            generateHKDFSalt(),

        );

    }

    // -------------------------------------------------------------
    // Encrypted Session Key
    // -------------------------------------------------------------

    static createEncryptedSessionKey(

        sessionId: string,

        sessionVersion: number,

        deviceId: string,

        deviceKeyId: string,

        encryptedSessionKey: Uint8Array,

        iv: Uint8Array,

        authTag: Uint8Array,

        hkdfSalt: Uint8Array,

        recipientKeyVersion: number,

    ): EncryptedSessionKey {

        validateSessionVersion(
            sessionVersion,
        );

        return {

            sessionId,

            deviceId,

            deviceKeyId,

            sessionVersion,

            encryptedSessionKey:
                toBase64Url(
                    encryptedSessionKey,
                ),

            iv:
                toBase64Url(
                    iv,
                ),

            authTag:
                toBase64Url(
                    authTag,
                ),

            hkdfSalt:
                toBase64Url(
                    hkdfSalt,
                ),

            hkdfInfo:
            HKDF_INFO.SESSION,

            recipientKeyVersion,

            createdAt:
                new Date().toISOString(),

        };

    }

    // -------------------------------------------------------------
// Attachment Key
// -------------------------------------------------------------

    static deriveAttachmentKey(

        sharedSecret: Uint8Array,

        consultationId: string,

        sessionVersion: number,

        salt = generateHKDFSalt(),

    ): DerivedKey {

        validateSessionVersion(
            sessionVersion,
        );

        return {

            key: HKDF.deriveFileKey(

                sharedSecret,

                salt,

            ),

            salt,

        };

    }

}