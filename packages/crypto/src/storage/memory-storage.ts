/**
 * ------------------------------------------------------------------
 * Memory Storage
 * ------------------------------------------------------------------
 *
 * In-memory implementation of KeyStorage.
 *
 * Intended for:
 * --------------
 * ✔ Unit Tests
 * ✔ Integration Tests
 * ✔ SSR
 * ✔ Node.js
 *
 * Nothing is persisted.
 *
 * ------------------------------------------------------------------
 */

import {

    type KeyStorage,

    type StoredSessionKey,

} from './key-storage';

import { type KeyPair } from '../interfaces';
import { type DeviceKey } from '../interfaces';

export class MemoryStorage

    implements KeyStorage {

    private identityKey: KeyPair | null = null;

    private signingKey: KeyPair | null = null;

    private signedPreKey: DeviceKey | null = null;

    private oneTimeKeys: DeviceKey[] = [];

    private readonly sessionKeys =
        new Map<
            string,
            StoredSessionKey
        >();

    // -------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------

    private sessionKey(

        consultationId: string,

        deviceId: string,

    ): string {

        return `${consultationId}:${deviceId}`;

    }

    // -------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------

    async saveIdentityKey(
        key: KeyPair,
    ): Promise<void> {

        this.identityKey = {
            ...key,
        };

    }

    async getIdentityKey(): Promise<KeyPair | null> {

        return this.identityKey
            ? {
                ...this.identityKey,
            }
            : null;

    }

    async deleteIdentityKey(): Promise<void> {

        this.identityKey = null;

    }

    // -------------------------------------------------------------
    // Signing
    // -------------------------------------------------------------

    async saveSigningKey(
        key: KeyPair,
    ): Promise<void> {

        this.signingKey = {
            ...key,
        };

    }

    async getSigningKey(): Promise<KeyPair | null> {

        return this.signingKey
            ? {
                ...this.signingKey,
            }
            : null;

    }

    async deleteSigningKey(): Promise<void> {

        this.signingKey = null;

    }

    // -------------------------------------------------------------
    // Signed PreKey
    // -------------------------------------------------------------

    async saveSignedPreKey(
        key: DeviceKey,
    ): Promise<void> {

        this.signedPreKey = {
            ...key,
        };

    }

    async getSignedPreKey(): Promise<DeviceKey | null> {

        return this.signedPreKey
            ? {
                ...this.signedPreKey,
            }
            : null;

    }

    async deleteSignedPreKey(): Promise<void> {

        this.signedPreKey = null;

    }

    // -------------------------------------------------------------
    // One-Time Keys
    // -------------------------------------------------------------

    async saveOneTimeKeys(
        keys: DeviceKey[],
    ): Promise<void> {

        this.oneTimeKeys = keys.map(

            key => ({
                ...key,
            }),

        );

    }

    async getOneTimeKeys(): Promise<DeviceKey[]> {

        return this.oneTimeKeys.map(

            key => ({
                ...key,
            }),

        );

    }

    async updateOneTimeKeys(
        keys: DeviceKey[],
    ): Promise<void> {

        this.oneTimeKeys = keys.map(

            key => ({
                ...key,
            }),

        );

    }

    // -------------------------------------------------------------
    // Session Keys
    // -------------------------------------------------------------

    async saveSessionKey(
        key: StoredSessionKey,
    ): Promise<void> {

        this.sessionKeys.set(

            this.sessionKey(
                key.consultationId,
                key.deviceId,
            ),

            {
                ...key,
            },

        );

    }

    async getSessionKey(

        consultationId: string,

        deviceId: string,

    ): Promise<StoredSessionKey | null> {

        const session = this.sessionKeys.get(

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

    async deleteSessionKey(

        consultationId: string,

        deviceId: string,

    ): Promise<void> {

        this.sessionKeys.delete(

            this.sessionKey(

                consultationId,

                deviceId,

            ),

        );

    }

    // -------------------------------------------------------------
    // Clear
    // -------------------------------------------------------------

    async clear(): Promise<void> {

        this.identityKey = null;

        this.signingKey = null;

        this.signedPreKey = null;

        this.oneTimeKeys = [];

        this.sessionKeys.clear();

    }

    // -------------------------------------------------------------
    // Close
    // -------------------------------------------------------------

    async close(): Promise<void> {

        // Nothing to close for in-memory storage.

    }

    // -------------------------------------------------------------
    // Destroy
    // -------------------------------------------------------------

    async destroy(): Promise<void> {

        await this.clear();

    }

    // -------------------------------------------------------------
// Session Keys
// -------------------------------------------------------------

    async getAllSessionKeys(): Promise<StoredSessionKey[]> {

        return Array.from(

            this.sessionKeys.values(),

            session => ({
                ...session,
            }),

        );

    }

    async deleteAllSessionKeys(): Promise<void> {

        this.sessionKeys.clear();

    }

}