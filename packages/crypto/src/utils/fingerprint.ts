/**
 * ------------------------------------------------------------------
 * Fingerprint Utilities
 * ------------------------------------------------------------------
 *
 * Generates human-readable fingerprints for public keys.
 *
 * Fingerprints are intended for:
 *
 * - Device verification
 * - QR code comparison
 * - Manual verification
 *
 * They MUST NOT be used for cryptographic operations.
 *
 * ------------------------------------------------------------------
 */

import { sha256 } from '@noble/hashes/sha2.js';


const DEFAULT_SHORT_FINGERPRINT_LENGTH = 32;


/**
 * Generate a full SHA-256 fingerprint.
 */
export function fingerprint(
    publicKey: Uint8Array,
): string {

    const hash: Uint8Array =
        sha256(publicKey);


    return Array
        .from(
            hash as Uint8Array,
        )
        .map(

            (byte: number) =>

                byte
                    .toString(16)
                    .padStart(
                        2,
                        '0',
                    )
                    .toUpperCase(),

        )
        .join(':');

}


/**
 * Generate shortened fingerprint.
 */
export function shortFingerprint(
    publicKey: Uint8Array,
    length =
        DEFAULT_SHORT_FINGERPRINT_LENGTH,
): string {


    if (
        !Number.isInteger(length) ||
        length <= 0
    ) {

        throw new Error(
            'Invalid fingerprint length.',
        );

    }


    return fingerprint(publicKey)
        .replace(
            /:/g,
            '',
        )
        .substring(
            0,
            length,
        );

}


/**
 * Compare fingerprints.
 */
export function equalFingerprint(
    left: string,
    right: string,
): boolean {


    return (

        left
            .replace(
                /:/g,
                '',
            )
            .toUpperCase()

        ===

        right
            .replace(
                /:/g,
                '',
            )
            .toUpperCase()

    );

}