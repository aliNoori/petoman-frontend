/**
 * ------------------------------------------------------------------
 * Secure Storage
 * ------------------------------------------------------------------
 *
 * Secure client storage abstraction.
 *
 * Intended implementations:
 * -------------------------
 * ✔ Capacitor Secure Storage
 * ✔ Expo SecureStore
 * ✔ React Native Keychain
 * ✔ Android Keystore
 * ✔ iOS Keychain
 *
 * This implementation is an adapter around a secure key/value store.
 *
 * ------------------------------------------------------------------
 */

import {
    type KeyStorage,
    type StoredSessionKey,
} from './key-storage';

import { type KeyPair } from '../interfaces';
import { type DeviceKey } from '../interfaces';

// ------------------------------------------------------------------
// Storage Keys
// ------------------------------------------------------------------

const STORAGE_KEYS = {

    IDENTITY: 'identity',

    SIGNING: 'signing',

    SIGNED_PRE_KEY: 'signed-pre-key',

    ONE_TIME_KEYS: 'one-time-keys',

    SESSION_INDEX: 'session-index',

} as const;

export interface SecureKeyValueStorage {

    get(
        key: string,
    ): Promise<string | null>;

    set(
        key: string,
        value: string,
    ): Promise<void>;

    remove(
        key: string,
    ): Promise<void>;

    clear(): Promise<void>;

}

export class SecureStorage
    implements KeyStorage {

    constructor(

        private readonly storage:
            SecureKeyValueStorage,

    ) {}

    // -------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------

    private sessionKey(

        consultationId: string,

        deviceId: string,

    ): string {

        return `session:${consultationId}:${deviceId}`;

    }

    private async write<T>(

        key: string,

        value: T,

    ): Promise<void> {

        await this.storage.set(

            key,

            JSON.stringify(value),

        );

    }

    private async read<T>(

        key: string,

    ): Promise<T | null> {

        const value =
            await this.storage.get(key);

        if (!value) {

            return null;

        }

        return JSON.parse(value) as T;

    }

    // -------------------------------------------------------------
    // Session Index
    // -------------------------------------------------------------

    private async getSessionIndex(): Promise<string[]> {

        return (

            await this.read<string[]>(

                STORAGE_KEYS.SESSION_INDEX,

            )

        ) ?? [];

    }

    private async saveSessionIndex(

        index: string[],

    ): Promise<void> {

        await this.write(

            STORAGE_KEYS.SESSION_INDEX,

            [...new Set(index)],

        );

    }

    private async addSessionToIndex(

        key: string,

    ): Promise<void> {

        const index =
            await this.getSessionIndex();

        if (!index.includes(key)) {

            index.push(key);

            await this.saveSessionIndex(
                index,
            );

        }

    }

    private async removeSessionFromIndex(

        key: string,

    ): Promise<void> {

        const index =
            await this.getSessionIndex();

        await this.saveSessionIndex(

            index.filter(

                current =>
                    current !== key,

            ),

        );

    }
    // -------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------

    async saveIdentityKey(
        key: KeyPair,
    ): Promise<void> {

        await this.write(

            STORAGE_KEYS.IDENTITY,

            {
                ...key,
            },

        );

    }

    async getIdentityKey(): Promise<KeyPair | null> {

        const key =
            await this.read<KeyPair>(

                STORAGE_KEYS.IDENTITY,

            );

        return key
            ? {
                ...key,
            }
            : null;

    }

    async deleteIdentityKey(): Promise<void> {

        await this.storage.remove(

            STORAGE_KEYS.IDENTITY,

        );

    }

    // -------------------------------------------------------------
    // Signing
    // -------------------------------------------------------------

    async saveSigningKey(
        key: KeyPair,
    ): Promise<void> {

        await this.write(

            STORAGE_KEYS.SIGNING,

            {
                ...key,
            },

        );

    }

    async getSigningKey(): Promise<KeyPair | null> {

        const key =
            await this.read<KeyPair>(

                STORAGE_KEYS.SIGNING,

            );

        return key
            ? {
                ...key,
            }
            : null;

    }

    async deleteSigningKey(): Promise<void> {

        await this.storage.remove(

            STORAGE_KEYS.SIGNING,

        );

    }

    // -------------------------------------------------------------
    // Signed PreKey
    // -------------------------------------------------------------

    async saveSignedPreKey(
        key: DeviceKey,
    ): Promise<void> {

        await this.write(

            STORAGE_KEYS.SIGNED_PRE_KEY,

            {
                ...key,
            },

        );

    }

    async getSignedPreKey(): Promise<DeviceKey | null> {

        const key =
            await this.read<DeviceKey>(

                STORAGE_KEYS.SIGNED_PRE_KEY,

            );

        return key
            ? {
                ...key,
            }
            : null;

    }

    async deleteSignedPreKey(): Promise<void> {

        await this.storage.remove(

            STORAGE_KEYS.SIGNED_PRE_KEY,

        );

    }

    // -------------------------------------------------------------
    // One-Time Keys
    // -------------------------------------------------------------

    async saveOneTimeKeys(
        keys: DeviceKey[],
    ): Promise<void> {

        await this.write(

            STORAGE_KEYS.ONE_TIME_KEYS,

            keys.map(

                key => ({
                    ...key,
                }),

            ),

        );

    }

    async getOneTimeKeys(): Promise<DeviceKey[]> {

        const keys =
            await this.read<DeviceKey[]>(

                STORAGE_KEYS.ONE_TIME_KEYS,

            );

        return keys
            ? keys.map(

                key => ({
                    ...key,
                }),

            )
            : [];

    }

    async updateOneTimeKeys(
        keys: DeviceKey[],
    ): Promise<void> {

        await this.saveOneTimeKeys(
            keys,
        );

    }

    // -------------------------------------------------------------
    // Session Keys
    // -------------------------------------------------------------

    async saveSessionKey(
        key: StoredSessionKey,
    ): Promise<void> {

        const storageKey = this.sessionKey(

            key.consultationId,

            key.deviceId,

        );

        await this.write(

            storageKey,

            {
                ...key,
            },

        );

        await this.addSessionToIndex(
            storageKey,
        );

    }

    async getSessionKey(

        consultationId: string,

        deviceId: string,

    ): Promise<StoredSessionKey | null> {

        const session =
            await this.read<StoredSessionKey>(

                this.sessionKey(

                    consultationId,

                    deviceId,

                ),

            );

        return session
            ? {
                ...session,
            }
            : null;

    }

    async getAllSessionKeys(): Promise<StoredSessionKey[]> {

        const index =
            await this.getSessionIndex();

        const sessions: StoredSessionKey[] = [];

        for (const key of index) {

            const session =
                await this.read<StoredSessionKey>(
                    key,
                );

            if (session) {

                sessions.push({
                    ...session,
                });

            }

        }

        return sessions;

    }

    async deleteSessionKey(

        consultationId: string,

        deviceId: string,

    ): Promise<void> {

        const storageKey =
            this.sessionKey(

                consultationId,

                deviceId,

            );

        await this.storage.remove(
            storageKey,
        );

        await this.removeSessionFromIndex(
            storageKey,
        );

    }

    async deleteAllSessionKeys(): Promise<void> {

        const index =
            await this.getSessionIndex();

        for (const key of index) {

            await this.storage.remove(
                key,
            );

        }

        await this.storage.remove(
            STORAGE_KEYS.SESSION_INDEX,
        );

    }

    // -------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------

    async clear(): Promise<void> {

        await this.storage.clear();

    }

    async close(): Promise<void> {

        // Nothing to close.

    }

    async destroy(): Promise<void> {

        await this.clear();

    }

}