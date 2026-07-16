/**
 * ------------------------------------------------------------------
 * Consultation Protocol
 * ------------------------------------------------------------------
 *
 * End-to-End encrypted consultation session establishment.
 *
 * Responsibilities
 * ----------------
 * ✔ Compute X25519 shared secret
 * ✔ Derive AES session key
 * ✔ Create encrypted session key payload
 * ✔ Rotate consultation session key
 *
 * Backend stores only:
 *   - Encrypted Session Key
 *   - HKDF Salt
 *   - Metadata
 *
 * Backend NEVER knows the AES session key.
 *
 * ------------------------------------------------------------------
 */

import { SessionKeyManager } from '../managers';

import { wipeBytes } from '../utils';

import {
    type EncryptedSessionKey,
} from '../interfaces';

import {type ConsultationSession} from "../types";


export class ConsultationProtocol {

    // -------------------------------------------------------------
    // Create Session
    // -------------------------------------------------------------

    static async create(

        consultationId: string,

        deviceId: string,

        myPrivateKey: string,

        remotePublicKey: string,

        sessionVersion = 1,

    ): Promise<ConsultationSession> {

        const sharedSecret =
            SessionKeyManager.createSharedSecret(

                myPrivateKey,

                remotePublicKey,

            );

        try {

            const derived =
                SessionKeyManager.deriveSessionKey(

                    sharedSecret,

                    consultationId,

                    sessionVersion,

                    deviceId,

                );

            return {

                consultationId,

                deviceId,

                sessionVersion,

                sessionKey:
                derived.key,

                salt:
                derived.salt,

                createdAt:
                    new Date(),

            };

        }
        finally {

            // Shared secret must not remain in memory.
            wipeBytes(sharedSecret);

        }

    }

    // -------------------------------------------------------------
    // Rotate Session
    // -------------------------------------------------------------

    static async rotate(

        session: ConsultationSession,

        myPrivateKey: string,

        remotePublicKey: string,

    ): Promise<ConsultationSession> {

        const sharedSecret =
            SessionKeyManager.createSharedSecret(

                myPrivateKey,

                remotePublicKey,

            );

        try {

            const rotated =
                SessionKeyManager.rotateSessionKey(

                    sharedSecret,

                    session.consultationId,

                    session.sessionVersion,

                    session.deviceId,

                );

            // Remove previous session key from memory.
            wipeBytes(
                session.sessionKey,
            );

            return {

                ...session,

                sessionVersion:
                    session.sessionVersion + 1,

                sessionKey:
                    rotated.key,

                salt:
                    rotated.salt,

            };

        }
        finally {

            // Shared secret must never remain in memory.
            wipeBytes(
                sharedSecret,
            );

        }

    }
    // -------------------------------------------------------------
    // Create Encrypted Session Key Payload
    // -------------------------------------------------------------

    static createEncryptedKeyPayload(

        consultationId: string,

        sessionVersion: number,

        deviceId: string,

        deviceKeyId: string,

        encryptedSessionKey: Uint8Array,

        iv: Uint8Array,

        authTag: Uint8Array,

        hkdfSalt: Uint8Array,

        recipientKeyVersion: number,

    ): EncryptedSessionKey {

        return SessionKeyManager.createEncryptedSessionKey(

            consultationId,

            sessionVersion,

            deviceId,

            deviceKeyId,

            encryptedSessionKey,

            iv,

            authTag,

            hkdfSalt,

            recipientKeyVersion,

        );

    }

}

