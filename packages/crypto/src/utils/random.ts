/**
 * ------------------------------------------------------------------
 * Random Utilities
 * ------------------------------------------------------------------
 *
 * Cryptographically secure random helpers.
 *
 * All randomness used by the Petoman Crypto SDK must originate
 * from this module.
 *
 * ------------------------------------------------------------------
 */

import { randomBytes } from '@noble/hashes/utils.js';

import { CRYPTO_CONSTANTS } from '../constants';

import {
    toBase64,
    toBase64Url,
} from './base64';

/**
 * Generate cryptographically secure random bytes.
 */
export function random(
    length: number,
): Uint8Array {

    if (
        !Number.isInteger(length) ||
        length <= 0
    ) {

        throw new Error(
            'Random length must be a positive integer.',
        );

    }

    return randomBytes(
        length,
    );

}

/**
 * Generate a Base64 encoded random string.
 */
export function randomBase64(
    length: number,
): string {

    return toBase64(
        random(length),
    );

}

/**
 * Generate a Base64URL encoded random string.
 */
export function randomBase64Url(
    length: number,
): string {

    return toBase64Url(
        random(length),
    );

}

/**
 * Generate a registration challenge.
 */
export function generateChallenge(): string {

    return randomBase64Url(
        CRYPTO_CONSTANTS.CHALLENGE_LENGTH,
    );

}
/**
 * Generate random identifier
 */
export function randomId(): string {

    return crypto.randomUUID();

}

/**
 * Generate a 256-bit AES key.
 */
export function generateAESKey(): Uint8Array {

    return random(
        CRYPTO_CONSTANTS.AES_KEY_LENGTH,
    );

}

/**
 * Generate an HKDF salt.
 */
export function generateHKDFSalt(): Uint8Array {

    return random(
        CRYPTO_CONSTANTS.HKDF_SALT_LENGTH,
    );

}

/**
 * Generate an AES-GCM initialization vector.
 */
export function generateIV(): Uint8Array {

    return random(
        CRYPTO_CONSTANTS.GCM_IV_LENGTH,
    );

}

/**
 * Generate a cryptographically secure random identifier.
 *
 * This is NOT a UUID.
 *
 * Intended for:
 * - Temporary identifiers
 * - Client-side tokens
 * - Correlation identifiers
 */
export function generateRandomId(
    length = 32,
): string {

    return randomBase64Url(
        length,
    );

}