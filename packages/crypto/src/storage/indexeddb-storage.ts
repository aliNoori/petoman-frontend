/**
 * ------------------------------------------------------------------
 * IndexedDB Storage
 * ------------------------------------------------------------------
 *
 * Browser implementation of KeyStorage.
 *
 * Storage
 * -------
 * Database:
 *      petoman-crypto
 *
 * Object Stores:
 *      identity
 *      signing
 *      signed-pre-key
 *      one-time-keys
 *      session-keys
 *
 * ------------------------------------------------------------------
 */

import {
    openDB,
    deleteDB,
    type DBSchema,
    type IDBPDatabase,
} from 'idb';

import {

    type KeyStorage,

    type StoredSessionKey,

} from './key-storage';

import { type KeyPair } from '../interfaces';
import { type DeviceKey } from '../interfaces';

const STORE = {
    IDENTITY: 'identity',
    SIGNING: 'signing',
    SIGNED_PRE_KEY: 'signed-pre-key',
    ONE_TIME_KEYS: 'one-time-keys',
    SESSION_KEYS: 'session-keys',
} as const;

interface CryptoDB extends DBSchema {

    identity: {

        key: string;

        value: KeyPair;

    };

    signing: {

        key: string;

        value: KeyPair;

    };

    'signed-pre-key': {

        key: string;

        value: DeviceKey;

    };

    'one-time-keys': {

        key: string;

        value: DeviceKey[];

    };

    'session-keys': {

        key: string;

        value: StoredSessionKey;

    };

}

export class IndexedDBStorage

    implements KeyStorage {

    private readonly dbName =
        'petoman-crypto';

    private readonly version = 1;

    private db: IDBPDatabase<CryptoDB> | undefined;

    // -------------------------------------------------------------
    // Open
    // -------------------------------------------------------------

    async open(): Promise<void> {

        if (

            this.db

        ) {

            return;

        }

        this.db = await openDB<CryptoDB>(

            this.dbName,

            this.version,

            {

                upgrade(db) {

                    if (

                        !db.objectStoreNames.contains(

                            STORE.IDENTITY,

                        )

                    ) {

                        db.createObjectStore(

                            STORE.IDENTITY,

                        );

                    }

                    if (

                        !db.objectStoreNames.contains(

                            STORE.SIGNING,

                        )

                    ) {

                        db.createObjectStore(

                            STORE.SIGNING,

                        );

                    }

                    if (

                        !db.objectStoreNames.contains(

                            STORE.SIGNED_PRE_KEY,

                        )

                    ) {

                        db.createObjectStore(

                            STORE.SIGNED_PRE_KEY,

                        );

                    }

                    if (

                        !db.objectStoreNames.contains(

                            STORE.ONE_TIME_KEYS,

                        )

                    ) {

                        db.createObjectStore(

                            STORE.ONE_TIME_KEYS,

                        );

                    }

                    if (

                        !db.objectStoreNames.contains(

                            STORE.SESSION_KEYS,

                        )

                    ) {

                        db.createObjectStore(

                            STORE.SESSION_KEYS,

                        );

                    }

                },

            },

        );

    }

    // -------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------

    private async database(): Promise<IDBPDatabase<CryptoDB>> {

        await this.open();

        if (!this.db) {

            throw new Error(
                'Database is not initialized.',
            );

        }

        return this.db;

    }

    private sessionKey(

        consultationId: string,

        deviceId: string,

    ) {

        return `${consultationId}:${deviceId}`;

    }

    // -------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------

    async saveIdentityKey(

        key: KeyPair,

    ) {

        const db =
            await this.database();

        await db.put(

            STORE.IDENTITY,

            key,

            STORE.IDENTITY,

        );

    }

    async getIdentityKey() {

        const db =
            await this.database();

        return (

            await db.get(

                STORE.IDENTITY,

                STORE.IDENTITY,

            )

        ) ?? null;

    }

    async deleteIdentityKey() {

        const db =
            await this.database();

        await db.delete(

            STORE.IDENTITY,

            STORE.IDENTITY,

        );

    }
    // -------------------------------------------------------------
    // Signing
    // -------------------------------------------------------------

    async saveSigningKey(

        key: KeyPair,

    ) {

        const db =
            await this.database();

        await db.put(

            STORE.SIGNING,

            key,

            STORE.SIGNING,

        );

    }

    async getSigningKey() {

        const db =
            await this.database();

        return (

            await db.get(

                STORE.SIGNING,

                STORE.SIGNING,

            )

        ) ?? null;

    }

    async deleteSigningKey() {

        const db =
            await this.database();

        await db.delete(

            STORE.SIGNING,

            STORE.SIGNING,

        );

    }

    // -------------------------------------------------------------
    // Signed PreKey
    // -------------------------------------------------------------

    async saveSignedPreKey(

        key: DeviceKey,

    ) {

        const db =
            await this.database();

        await db.put(

            STORE.SIGNED_PRE_KEY,

            key,

            'current',

        );

    }

    async getSignedPreKey() {

        const db =
            await this.database();

        return (

            await db.get(

                STORE.SIGNED_PRE_KEY,

                'current',

            )

        ) ?? null;

    }

    async deleteSignedPreKey() {

        const db =
            await this.database();

        await db.delete(

            STORE.SIGNED_PRE_KEY,

            'current',

        );

    }

    // -------------------------------------------------------------
    // One-Time Keys
    // -------------------------------------------------------------

    async saveOneTimeKeys(

        keys: DeviceKey[],

    ) {

        const db =
            await this.database();

        await db.put(

            STORE.ONE_TIME_KEYS,

            keys,

            'keys',

        );

    }

    async getOneTimeKeys() {

        const db =
            await this.database();

        return (

            await db.get(

                STORE.ONE_TIME_KEYS,

                'keys',

            )

        ) ?? [];

    }

    async updateOneTimeKeys(

        keys: DeviceKey[],

    ) {

        const db =
            await this.database();

        await db.put(

            STORE.ONE_TIME_KEYS,

            keys,

            'keys',

        );

    }
    // -------------------------------------------------------------
    // Session Keys
    // -------------------------------------------------------------

    async saveSessionKey(

        key: StoredSessionKey,

    ) {

        const db =
            await this.database();

        await db.put(

            STORE.SESSION_KEYS,

            key,

            this.sessionKey(

                key.consultationId,

                key.deviceId,

            ),

        );

    }

    async getSessionKey(

        consultationId: string,

        deviceId: string,

    ) {

        const db =
            await this.database();

        return (

            await db.get(

                STORE.SESSION_KEYS,

                this.sessionKey(

                    consultationId,

                    deviceId,

                ),

            )

        ) ?? null;

    }

    // -------------------------------------------------------------
// Get All Session Keys
// -------------------------------------------------------------

    async getAllSessionKeys(): Promise<StoredSessionKey[]> {

        const db =
            await this.database();

        return await db.getAll(
            STORE.SESSION_KEYS,
        );

    }

    async deleteSessionKey(

        consultationId: string,

        deviceId: string,

    ) {

        const db =
            await this.database();

        await db.delete(

            STORE.SESSION_KEYS,

            this.sessionKey(

                consultationId,

                deviceId,

            ),

        );

    }

    // -------------------------------------------------------------
// Delete All Session Keys
// -------------------------------------------------------------

    async deleteAllSessionKeys(): Promise<void> {

        const db =
            await this.database();

        await db.clear(
            STORE.SESSION_KEYS,
        );

    }

    async close(): Promise<void> {

        this.db?.close();

        this.db = undefined;

    }

    async destroy(): Promise<void> {

        await this.close();

        await deleteDB(this.dbName);

    }

    // -------------------------------------------------------------
    // Clear
    // -------------------------------------------------------------

    async clear() {

        const db =
            await this.database();

        await db.clear(
            STORE.IDENTITY,
        );

        await db.clear(
            STORE.SIGNING,
        );

        await db.clear(
            STORE.SIGNED_PRE_KEY,
        );

        await db.clear(
            STORE.ONE_TIME_KEYS,
        );

        await db.clear(
            STORE.SESSION_KEYS,
        );

    }



}