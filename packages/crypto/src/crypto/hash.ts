/**
 * ------------------------------------------------------------------
 * Hash
 * ------------------------------------------------------------------
 *
 * Shared hashing utilities.
 *
 * Supported Algorithms
 * --------------------
 * ✔ SHA-256
 * ✔ SHA-512
 *
 * ------------------------------------------------------------------
 */

import {
    sha256,
    sha512,
} from '@noble/hashes/sha2.js';

import {
    bytesToHex,
} from '@noble/hashes/utils.js';
import {equalBytes} from "../utils";

/**
 * SHA-256
 */
export function hash256(
    data: Uint8Array,
): Uint8Array {

    return sha256(data);

}

/**
 * SHA-512
 */
export function hash512(
    data: Uint8Array,
): Uint8Array {

    return sha512(data);

}

/**
 * SHA-256 (HEX)
 */
export function hash256Hex(
    data: Uint8Array,
): string {

    return bytesToHex(
        hash256(data),
    );

}

/**
 * SHA-512 (HEX)
 */
export function hash512Hex(
    data: Uint8Array,
): string {

    return bytesToHex(
        hash512(data),
    );

}

/**
 * Double SHA-256
 */
export function doubleHash256(
    data: Uint8Array,
): Uint8Array {

    return hash256(
        hash256(data),
    );

}

/**
 * Constant-time comparison.
 */
export function equalHash(
    left: Uint8Array,
    right: Uint8Array,
): boolean {

    return equalBytes(
        left,
        right,
    );

}