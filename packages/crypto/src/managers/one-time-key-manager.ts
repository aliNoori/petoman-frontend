/**
 * ------------------------------------------------------------------
 * One-Time Key Manager
 * ------------------------------------------------------------------
 *
 * Responsibilities
 * ----------------
 * ✔ Generate One-Time PreKeys
 * ✔ Allocate next available key
 * ✔ Mark consumed keys
 * ✔ Replace consumed keys
 * ✔ Count remaining keys
 *
 * ------------------------------------------------------------------
 */

import { X25519 } from '../crypto';

import { type DeviceKey } from '../interfaces';

import { DeviceKeyType } from '../enums';
import { KeyAlgorithm } from '../enums';

import { CRYPTO_CONSTANTS } from '../constants';

import { randomId } from '../utils';

export interface OneTimePrivateKey {

    id: string;

    privateKey: string;

}

export interface OneTimeKeyBundle {

    publicKeys: DeviceKey[];

    privateKeys: OneTimePrivateKey[];

}

export class OneTimeKeyManager {

    private static createDeviceKey(
        id: string,
        publicKey: string,
        deviceId = '',
        version: number = 1,
    ): DeviceKey {

        return {

            id,

            deviceId,

            type: DeviceKeyType.ONE_TIME_PRE_KEY,

            algorithm: KeyAlgorithm.X25519,

            publicKey,

            version,

            consumed: false,

            createdAt: new Date().toISOString(),

        };

    }

    // -------------------------------------------------------------
    // Generate
    // -------------------------------------------------------------

    static generate(
        count: number = CRYPTO_CONSTANTS.DEFAULT_ONE_TIME_PREKEY_COUNT,
        deviceId = '',
        version: number = 1,
    ): OneTimeKeyBundle {

        if (!Number.isInteger(count) || count <= 0) {

            throw new Error(
                'Invalid one-time pre-key count.',
            );

        }

        const publicKeys: DeviceKey[] = [];

        const privateKeys: OneTimePrivateKey[] = [];

        for (let i = 0; i < count; i++) {

            const pair = X25519.generateKeyPair();

            const id = randomId();

            publicKeys.push(

                this.createDeviceKey(
                    id,
                    pair.publicKey,
                    deviceId,
                    version,
                ),

            );

            privateKeys.push({

                id,

                privateKey: pair.privateKey,

            });

        }

        return {

            publicKeys,

            privateKeys,

        };

    }

    // -------------------------------------------------------------
    // Allocate
    // -------------------------------------------------------------

    static allocate(
        keys: readonly DeviceKey[],
    ): DeviceKey | null {

        return keys.find(

            key => !key.consumed,

        ) ?? null;

    }

    // -------------------------------------------------------------
    // Consume
    // -------------------------------------------------------------

    static consume(
        keys: readonly DeviceKey[],
        keyId: string,
    ): DeviceKey[] {

        return keys.map(

            key =>

                key.id === keyId
                    ? {
                        ...key,
                        consumed: true,
                    }
                    : key,

        );

    }

    // -------------------------------------------------------------
    // Replace Consumed
    // -------------------------------------------------------------

    static replaceConsumed(
        keys: readonly DeviceKey[],
        deviceId = '',
        version: number = 1,
    ): OneTimeKeyBundle {

        const active = keys.filter(

            key => !key.consumed,

        );

        const required =
            CRYPTO_CONSTANTS.DEFAULT_ONE_TIME_PREKEY_COUNT
            - active.length;

        if (required <= 0) {

            return {

                publicKeys: [],

                privateKeys: [],

            };

        }

        return this.generate(

            required,

            deviceId,

            version,

        );

    }

    // -------------------------------------------------------------
    // Remaining
    // -------------------------------------------------------------

    static remaining(
        keys: readonly DeviceKey[],
    ): number {

        return keys.filter(

            key => !key.consumed,

        ).length;

    }

    // -------------------------------------------------------------
    // Needs Refill
    // -------------------------------------------------------------

    static needsRefill(
        keys: readonly DeviceKey[],
        threshold = CRYPTO_CONSTANTS.ONE_TIME_PREKEY_REFILL_THRESHOLD,
    ): boolean {

        return this.remaining(keys) <= threshold;

    }

}