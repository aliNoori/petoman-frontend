/**
 * ------------------------------------------------------------------
 * Key Rotation Manager
 * ------------------------------------------------------------------
 *
 * Responsibilities
 * ----------------
 * ✔ Decide when keys must rotate
 * ✔ Rotate Signed PreKeys
 * ✔ Rotate Session Keys
 * ✔ Rotate One-Time PreKeys
 * ✔ Calculate expiration
 *
 * No storage.
 * No networking.
 *
 * ------------------------------------------------------------------
 */

import { type DeviceKey } from '../interfaces';

import { DeviceKeyManager } from './device-key-manager';
import { SessionKeyManager } from './session-key-manager';
import { OneTimeKeyManager } from './one-time-key-manager';

import { CRYPTO_CONSTANTS } from '../constants';

export class KeyRotationManager {

    private constructor() {}

    private static readonly DAY_MS =
        24 * 60 * 60 * 1000;

    // -------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------

    private static normalizeDate(

        value: Date | string,

    ): Date {

        const date =

            value instanceof Date
                ? value
                : new Date(value);

        if (

            Number.isNaN(
                date.getTime(),
            )

        ) {

            throw new Error(
                'Invalid creation date.',
            );

        }

        return date;

    }

    // -------------------------------------------------------------
    // Signed PreKey
    // -------------------------------------------------------------

    static shouldRotateSignedPreKey(

        createdAt: Date | string,

    ): boolean {

        const created =
            this.normalizeDate(
                createdAt,
            );

        return (

            new Date()

            >=

            this.nextRotationDate(
                created,
            )

        );

    }

    static rotateSignedPreKey(

        deviceId: string,

        signingPrivateKey: string,

        currentVersion: number,

    ) {

        return DeviceKeyManager.rotateSignedPreKey(

            deviceId,

            signingPrivateKey,

            currentVersion,

        );

    }

    // -------------------------------------------------------------
    // Session Key
    // -------------------------------------------------------------

    static rotateSessionKey(

        sharedSecret: Uint8Array,

        consultationId: string,

        currentVersion: number,

        deviceId: string,

    ) {

        return SessionKeyManager.rotateSessionKey(

            sharedSecret,

            consultationId,

            currentVersion,

            deviceId,

        );

    }

    // -------------------------------------------------------------
    // One-Time PreKeys
    // -------------------------------------------------------------

    static refillOneTimeKeys(

        keys: DeviceKey[],

    ) {

        if (!keys.length) {

            return [];

        }

        return OneTimeKeyManager.replaceConsumed(

            keys,

        );

    }

    static shouldRefillOneTimeKeys(

        keys: DeviceKey[],

    ): boolean {

        if (!keys.length) {

            return true;

        }

        return OneTimeKeyManager.needsRefill(

            keys,

            CRYPTO_CONSTANTS.ONE_TIME_PREKEY_REFILL_THRESHOLD,

        );

    }

    // -------------------------------------------------------------
    // Expiration
    // -------------------------------------------------------------

    static nextRotationDate(

        createdAt: Date | string,

    ): Date {

        const created =
            this.normalizeDate(
                createdAt,
            );

        return new Date(

            created.getTime()

            +

            (

                CRYPTO_CONSTANTS.SIGNED_PREKEY_ROTATION_DAYS

                *

                this.DAY_MS

            ),

        );

    }

}