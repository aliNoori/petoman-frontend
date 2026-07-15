/**
 * ------------------------------------------------------------------
 * HKDF
 * ------------------------------------------------------------------
 *
 * RFC 5869
 *
 * Key derivation using HKDF-SHA256.
 *
 * Responsibilities
 * ----------------
 * ✔ Session Keys
 * ✔ File Keys
 * ✔ Voice Keys
 * ✔ Image Keys
 * ✔ Video Keys
 * ✔ Backup Keys
 *
 * ------------------------------------------------------------------
 */

import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

import {HKDF_INFO, type HKDFInfo} from '../constants';
import { CRYPTO_CONSTANTS } from '../constants';

import {
    validateSalt,
    validateSessionVersion,
    validateX25519Key,
} from '../utils';

export class HKDF {

    // -------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------

    private static derive(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

        info: HKDFInfo | string,

        length =
            CRYPTO_CONSTANTS.HKDF_OUTPUT_LENGTH,

    ): Uint8Array {

        validateX25519Key(
            sharedSecret,
        );

        validateSalt(
            salt,
        );

        if (
            !Number.isInteger(length) ||
            length <= 0
        ) {
            throw new Error(
                'Invalid HKDF output length.',
            );
        }

        return hkdf(

            sha256,

            sharedSecret,

            salt,

            new TextEncoder().encode(info),

            length,

        ) as any;

    }

    // -------------------------------------------------------------
    // Session Key
    // -------------------------------------------------------------

    static deriveSessionKey(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

        consultationId: string,

        sessionVersion: number,

        deviceId: string,

    ): Uint8Array {

        validateSessionVersion(
            sessionVersion,
        );

        const info = [

            HKDF_INFO.SESSION,

            consultationId,

            sessionVersion,

            deviceId,

        ].join(':');

        return this.derive(

            sharedSecret,

            salt,

            info,

        );

    }

    // -------------------------------------------------------------
    // File Key
    // -------------------------------------------------------------

    static deriveFileKey(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

    ): Uint8Array {

        return this.derive(

            sharedSecret,

            salt,

            HKDF_INFO.FILE,

        );

    }

    // -------------------------------------------------------------
    // Image Key
    // -------------------------------------------------------------

    static deriveImageKey(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

    ): Uint8Array {

        return this.derive(

            sharedSecret,

            salt,

            HKDF_INFO.IMAGE,

        );

    }

    // -------------------------------------------------------------
    // Voice Key
    // -------------------------------------------------------------

    static deriveVoiceKey(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

    ): Uint8Array {

        return this.derive(

            sharedSecret,

            salt,

            HKDF_INFO.VOICE,

        );

    }

    // -------------------------------------------------------------
    // Video Key
    // -------------------------------------------------------------

    static deriveVideoKey(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

    ): Uint8Array {

        return this.derive(

            sharedSecret,

            salt,

            HKDF_INFO.VIDEO,

        );

    }

    // -------------------------------------------------------------
    // Backup Key
    // -------------------------------------------------------------

    static deriveBackupKey(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

    ): Uint8Array {

        return this.derive(

            sharedSecret,

            salt,

            HKDF_INFO.BACKUP,

        );

    }

    // -------------------------------------------------------------
    // Custom Key
    // -------------------------------------------------------------

    static deriveCustomKey(

        sharedSecret: Uint8Array,

        salt: Uint8Array,

        info: HKDFInfo | string,

        length =
            CRYPTO_CONSTANTS.HKDF_OUTPUT_LENGTH,

    ): Uint8Array {

        if (!info.trim()) {
            throw new Error(
                'HKDF info is required.',
            );
        }

        return this.derive(

            sharedSecret,

            salt,

            info,

            length,

        );

    }

}