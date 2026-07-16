/**
 * ------------------------------------------------------------------
 * Signature
 * ------------------------------------------------------------------
 *
 * Ed25519 Digital Signatures
 *
 * Responsibilities
 * ----------------
 * ✔ Generate signing key pair
 * ✔ Sign messages
 * ✔ Verify signatures
 * ✔ Import / Export keys
 *
 * ------------------------------------------------------------------
 */

import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';

import { type KeyPair } from '../interfaces';

import { KeyAlgorithm } from '../enums';

import { CRYPTO_CONSTANTS } from '../constants';

import {
    toBase64Url,
    fromBase64Url,
} from '../utils';

const sha512Async = async (
    ...messages: Uint8Array[]
): Promise<Uint8Array> => {

    const length =
        messages.reduce(
            (sum, item) =>
                sum + item.length,
            0,
        );


    const merged =
        new Uint8Array(length);


    let offset = 0;


    for (const item of messages) {

        merged.set(
            item,
            offset,
        );

        offset += item.length;

    }


    return sha512(
        merged,
    );

};

export class Signature {

    // -------------------------------------------------------------
    // Generate Key Pair
    // -------------------------------------------------------------

    static async generateKeyPair(): Promise<KeyPair> {

        const privateKey =
            ed.utils.randomSecretKey();

        const publicKey =
            await ed.getPublicKeyAsync(
                privateKey,
            );

        return {

            algorithm:
            KeyAlgorithm.ED25519,

            privateKey:
                toBase64Url(
                    privateKey,
                ),

            publicKey:
                toBase64Url(
                    publicKey,
                ),

        };

    }

    // -------------------------------------------------------------
    // Sign
    // -------------------------------------------------------------

    static async sign(

        message: Uint8Array,

        privateKey: Uint8Array,

    ): Promise<Uint8Array> {

        if (
            !this.isPrivateKey(
                privateKey,
            )
        ) {

            throw new Error(
                'Invalid Ed25519 private key.',
            );

        }

        return ed.signAsync(

            message,

            privateKey,

        );

    }
    // -------------------------------------------------------------
    // Verify
    // -------------------------------------------------------------

    static async verify(

        message: Uint8Array,

        signature: Uint8Array,

        publicKey: Uint8Array,

    ): Promise<boolean> {

        if (
            !this.isPublicKey(
                publicKey,
            )
        ) {

            throw new Error(
                'Invalid Ed25519 public key.',
            );

        }

        if (
            !this.isSignature(
                signature,
            )
        ) {

            throw new Error(
                'Invalid Ed25519 signature.',
            );

        }

        return ed.verifyAsync(

            signature,

            message,

            publicKey,

        );

    }

    // -------------------------------------------------------------
    // Export
    // -------------------------------------------------------------

    static exportKey(
        key: Uint8Array,
    ): string {

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

        return fromBase64Url(
            value,
        );

    }

    // -------------------------------------------------------------
    // Validation
    // -------------------------------------------------------------

    static isPublicKey(
        key: Uint8Array,
    ): boolean {

        return (

            key.length ===

            CRYPTO_CONSTANTS.ED25519_PUBLIC_KEY_LENGTH

        );

    }

    static isPrivateKey(
        key: Uint8Array,
    ): boolean {

        return (

            key.length ===

            CRYPTO_CONSTANTS.ED25519_PRIVATE_KEY_LENGTH

        );

    }

    static isSignature(
        signature: Uint8Array,
    ): boolean {

        return (

            signature.length ===

            CRYPTO_CONSTANTS.ED25519_SIGNATURE_LENGTH

        );

    }

}