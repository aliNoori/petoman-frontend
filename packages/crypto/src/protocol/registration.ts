
/**
 * ------------------------------------------------------------------
 * Registration Protocol
 * ------------------------------------------------------------------
 *
 * Device Registration Flow
 *
 * Responsibilities
 * ----------------
 * ✔ Generate registration bundle
 * ✔ Verify signed pre-key
 * ✔ Build upload payload
 * ✔ Create bootstrap package
 *
 * Backend stores ONLY public keys.
 *
 * ------------------------------------------------------------------
 */

import { DeviceKeyManager } from '../managers';
import { OneTimeKeyManager } from '../managers';

import { type DeviceKey } from '../interfaces';

import { CRYPTO_CONSTANTS } from '../constants';

export interface RegistrationPackage {

    cryptoVersion: number;

    identityPublicKey: string;

    signingPublicKey: string;

    signedPreKey: DeviceKey;

    oneTimePreKeys: DeviceKey[];

    createdAt: string;

}

export interface RegistrationSecrets {

    identityPrivateKey: string;

    signingPrivateKey: string;

    signedPreKeyPrivateKey: string;

    oneTimePrivateKeys: Record<string, string>;

}

export interface RegistrationBundle {

    registration: RegistrationPackage;

    secrets: RegistrationSecrets;

}

export class RegistrationProtocol {

    // -------------------------------------------------------------
    // Create Registration Bundle
    // -------------------------------------------------------------

    static async create(
        deviceId: string,
    ): Promise<RegistrationBundle> {

        const registrationKeys =
            await DeviceKeyManager.createRegistrationPayload(deviceId);

        const oneTimeKeys =
            OneTimeKeyManager.generate();

        const privateKeys:
            Record<string, string> = {};

        for (const key of oneTimeKeys.privateKeys) {

            privateKeys[key.id] =
                key.privateKey;

        }
        return {

            registration: {

                cryptoVersion:
                    CRYPTO_CONSTANTS.CRYPTO_VERSION,

                identityPublicKey:

                    registrationKeys
                        .identityKey
                        .publicKey,

                signingPublicKey:

                    registrationKeys
                        .signingKey
                        .publicKey,

                signedPreKey:
                registrationKeys
                    .signedPreKey
                    .publicKey,

                oneTimePreKeys:

                    oneTimeKeys
                        .publicKeys,

                createdAt:
                    new Date().toISOString(),

            },

            secrets: {

                identityPrivateKey:

                    registrationKeys
                        .identityKey
                        .privateKey,

                signingPrivateKey:

                    registrationKeys
                        .signingKey
                        .privateKey,

                signedPreKeyPrivateKey:

                registrationKeys
                    .signedPreKey
                    .privateKey,

                oneTimePrivateKeys:

                    privateKeys,

            },

        };

    }

    // -------------------------------------------------------------
    // Verify Signed PreKey
    // -------------------------------------------------------------

    static async verify(

        signedPreKey: DeviceKey,

        signingPublicKey: string,

    ): Promise<boolean> {

        return DeviceKeyManager.verifySignedPreKey(

            signedPreKey,

            signingPublicKey,

        );

    }

    // -------------------------------------------------------------
    // Upload Payload
    // -------------------------------------------------------------

    static createUploadPayload(

        bundle: RegistrationBundle,

    ): RegistrationPackage {

        return {

            cryptoVersion:
                bundle.registration.cryptoVersion,

            identityPublicKey:
                bundle.registration.identityPublicKey,

            signingPublicKey:
                bundle.registration.signingPublicKey,

            signedPreKey:
                bundle.registration.signedPreKey,

            oneTimePreKeys:
                [...bundle.registration.oneTimePreKeys],

            createdAt:
                bundle.registration.createdAt,

        };

    }

}


