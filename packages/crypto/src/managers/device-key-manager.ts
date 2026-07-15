/**
 * ------------------------------------------------------------------
 * Device Key Manager
 * ------------------------------------------------------------------
 *
 * Responsibilities
 * ----------------
 * ✔ Generate Identity Key
 * ✔ Generate Signing Key
 * ✔ Generate Signed PreKey
 * ✔ Verify Signed PreKey
 * ✔ Create Registration Payload
 * ✔ Rotate Signed PreKey
 *
 * Stateless manager.
 *
 * ------------------------------------------------------------------
 */

import { X25519 } from '../crypto';
import { Signature } from '../crypto';

import { type DeviceKey } from '../interfaces';
import { type KeyPair } from '../interfaces';

import { DeviceKeyType } from '../enums';
import { KeyAlgorithm } from '../enums';

import { CRYPTO_CONSTANTS } from '../constants';

import { randomId } from '../utils';

export interface GeneratedSignedPreKey {

    publicKey: DeviceKey;

    privateKey: string;

}

export interface DeviceRegistrationPayload {

    identityKey: KeyPair;

    signingKey: KeyPair;

    signedPreKey: GeneratedSignedPreKey;

}

export class DeviceKeyManager {

    // -------------------------------------------------------------
    // Identity Key
    // -------------------------------------------------------------

    static generateIdentityKey(): KeyPair {

        const pair =
            X25519.generateKeyPair();

        return {

            ...pair,

            version:
            CRYPTO_CONSTANTS.INITIAL_SESSION_VERSION,

            createdAt:
                new Date().toISOString(),

        };

    }

    // -------------------------------------------------------------
    // Signing Key
    // -------------------------------------------------------------

    static async generateSigningKey(): Promise<KeyPair> {

        const pair =
            await Signature.generateKeyPair();

        return {

            ...pair,

            version:
            CRYPTO_CONSTANTS.INITIAL_SESSION_VERSION,

        };

    }

    // -------------------------------------------------------------
    // Generate Signed PreKey
    // -------------------------------------------------------------

    static async generateSignedPreKey(

        deviceId: string,

        signingPrivateKey: string,

        version:number =
            CRYPTO_CONSTANTS.INITIAL_SESSION_VERSION,

    ): Promise<GeneratedSignedPreKey> {

        const pair =
            X25519.generateKeyPair();

        const signature =
            await Signature.sign(

                X25519.importKey(
                    pair.publicKey,
                ),

                Signature.importKey(
                    signingPrivateKey,
                ),

            );

        const createdAt =
            new Date();

        const expiresAt =
            new Date(

                createdAt.getTime()

                +

                30 * 24 * 60 * 60 * 1000,

            );

        return {

            privateKey:
            pair.privateKey,

            publicKey: {

                id:
                    randomId(),

                deviceId,

                type:
                DeviceKeyType.SIGNED_PRE_KEY,

                algorithm:
                KeyAlgorithm.X25519,

                publicKey:
                pair.publicKey,

                signature:
                    Signature.exportKey(
                        signature,
                    ),

                version,

                consumed: false,

                createdAt:
                    createdAt.toISOString(),

                expiresAt:
                    expiresAt.toISOString(),

            },

        };

    }
    // -------------------------------------------------------------
    // Verify Signed PreKey
    // -------------------------------------------------------------

    static async verifySignedPreKey(

        signedPreKey: DeviceKey,

        signingPublicKey: string,

    ): Promise<boolean> {

        if (

            signedPreKey.type !==
            DeviceKeyType.SIGNED_PRE_KEY

        ) {

            return false;

        }

        if (

            signedPreKey.algorithm !==
            KeyAlgorithm.X25519

        ) {

            return false;

        }

        if (

            !signedPreKey.signature

        ) {

            return false;

        }

        try {

            return await Signature.verify(

                X25519.importKey(
                    signedPreKey.publicKey,
                ),

                Signature.importKey(
                    signedPreKey.signature,
                ),

                Signature.importKey(
                    signingPublicKey,
                ),

            );

        }

        catch {

            return false;

        }

    }

    // -------------------------------------------------------------
    // Registration Payload
    // -------------------------------------------------------------

    static async createRegistrationPayload(

        deviceId: string,

    ): Promise<DeviceRegistrationPayload> {

        const identityKey =
            this.generateIdentityKey();

        const signingKey =
            await this.generateSigningKey();

        const signedPreKey =
            await this.generateSignedPreKey(

                deviceId,

                signingKey.privateKey,

            );

        return {

            identityKey,

            signingKey,

            signedPreKey,

        };

    }

    // -------------------------------------------------------------
    // Rotate Signed PreKey
    // -------------------------------------------------------------

    static rotateSignedPreKey(

        deviceId: string,

        signingPrivateKey: string,

        currentVersion: number,

    ): Promise<GeneratedSignedPreKey> {

        return this.generateSignedPreKey(

            deviceId,

            signingPrivateKey,

            currentVersion + 1,

        );

    }

}