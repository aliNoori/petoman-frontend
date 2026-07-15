/**
 * ------------------------------------------------------------------
 * Key Storage
 * ------------------------------------------------------------------
 *
 * Abstract storage contract used by every client.
 *
 * Implementations
 * ---------------
 * ✔ IndexedDB
 * ✔ Secure Storage (Mobile)
 * ✔ Memory Storage
 *
 * Responsibilities
 * ----------------
 * ✔ Store Identity Keys
 * ✔ Store Signing Keys
 * ✔ Store Session Keys
 * ✔ Store One-Time Keys
 * ✔ Delete Keys
 * ✔ Clear Storage
 *
 * ------------------------------------------------------------------
 */

import { type DeviceKey } from '../interfaces';
import { type KeyPair } from '../interfaces';

export interface StoredSessionKey {

    consultationId: string;

    deviceId: string;

    version: number;

    encryptedKey: string;

    hkdfSalt: string;

    createdAt: string;

    updatedAt?: string;

    expiresAt?: string;

}

export interface KeyStorage {

    // -------------------------------------------------------------
    // Identity Key
    // -------------------------------------------------------------

    saveIdentityKey(
        key: KeyPair,
    ): Promise<void>;

    getIdentityKey(): Promise<KeyPair | null>;

    deleteIdentityKey(): Promise<void>;

    // -------------------------------------------------------------
    // Signing Key
    // -------------------------------------------------------------

    saveSigningKey(
        key: KeyPair,
    ): Promise<void>;

    getSigningKey(): Promise<KeyPair | null>;

    deleteSigningKey(): Promise<void>;

    // -------------------------------------------------------------
    // Signed PreKey
    // -------------------------------------------------------------

    saveSignedPreKey(
        key: DeviceKey,
    ): Promise<void>;

    getSignedPreKey(): Promise<DeviceKey | null>;

    deleteSignedPreKey(): Promise<void>;

    // -------------------------------------------------------------
    // One-Time PreKeys
    // -------------------------------------------------------------

    saveOneTimeKeys(
        keys: DeviceKey[],
    ): Promise<void>;

    getOneTimeKeys(): Promise<DeviceKey[]>;

    getAllSessionKeys(): Promise<StoredSessionKey[]>;

    // -------------------------------------------------------------
    // Session Keys
    // -------------------------------------------------------------

    saveSessionKey(
        key: StoredSessionKey,
    ): Promise<void>;

    getSessionKey(

        consultationId: string,

        deviceId: string,

    ): Promise<StoredSessionKey | null>;

    deleteSessionKey(

        consultationId: string,

        deviceId: string,

    ): Promise<void>;

    // -------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------

    deleteAllSessionKeys(): Promise<void>;

    close(): Promise<void>;

    destroy(): Promise<void>;

}