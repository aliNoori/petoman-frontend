/**
 * ------------------------------------------------------------------
 * X25519
 * ------------------------------------------------------------------
 *
 * RFC 7748
 *
 * Responsibilities
 * ----------------
 * ✔ Generate key pairs
 * ✔ Compute shared secrets
 * ✔ Import / Export keys
 * ✔ Validate keys
 *
 * Private keys MUST never leave the client.
 *
 * ------------------------------------------------------------------
 */

import { x25519 } from '@noble/curves/ed25519.js';
import { randomBytes } from '@noble/hashes/utils.js';

import { type KeyPair } from '../interfaces';

import { KeyAlgorithm } from '../enums';

import { CRYPTO_CONSTANTS } from '../constants';

import {
    validateX25519Key,
} from '../utils';

import {
    toBase64Url,
    fromBase64Url,
} from '../utils';

export class X25519 {

    // -------------------------------------------------------------
    // Generate Key Pair
    // -------------------------------------------------------------

    static generateKeyPair(): KeyPair {

        const privateKey = randomBytes(
            CRYPTO_CONSTANTS.X25519_KEY_LENGTH,
        );

        const publicKey =
            x25519.getPublicKey(
                privateKey,
            );

        return {

            algorithm:
            KeyAlgorithm.X25519,

            privateKey:
                toBase64Url(
                    privateKey,
                ),

            publicKey:
                toBase64Url(
                    publicKey,
                ),

            createdAt:
                new Date().toISOString(),

        };

    }

    // -------------------------------------------------------------
    // Shared Secret
    // -------------------------------------------------------------

    static computeSharedSecret(

        privateKey: Uint8Array,

        publicKey: Uint8Array,

    ): Uint8Array {

        validateX25519Key(
            privateKey,
        );

        validateX25519Key(
            publicKey,
        );

        return x25519.getSharedSecret(

            privateKey,

            publicKey,

        );

    }

    // -------------------------------------------------------------
    // Export
    // -------------------------------------------------------------

    static exportKey(
        key: Uint8Array,
    ): string {

        validateX25519Key(
            key,
        );

        return toBase64Url(
            key,
        );

    }

    // -------------------------------------------------------------
    // Import
    // -------------------------------------------------------------

    static importKey(
        value: string,
    ): Uint8Array {

        const key =
            fromBase64Url(
                value,
            );

        validateX25519Key(
            key,
        );

        return key;

    }

    // -------------------------------------------------------------
    // Clone
    // -------------------------------------------------------------

    static clone(
        key: Uint8Array,
    ): Uint8Array {

        validateX25519Key(
            key,
        );

        return Uint8Array.from(
            key,
        );

    }

    // -------------------------------------------------------------
    // Zeroize
    // -------------------------------------------------------------

    static wipe(
        key?: Uint8Array,
    ): void {

        if (!key) {

            return;

        }

        key.fill(0);

    }

}