/**
 * ------------------------------------------------------------------
 * Base64 Utilities
 * ------------------------------------------------------------------
 *
 * Shared Base64 / Base64URL helpers.
 *
 * Browser + Node compatible.
 *
 * ------------------------------------------------------------------
 */

function hasBuffer(): boolean {

    return typeof Buffer !== 'undefined';

}

function encodeBase64(
    binary: string,
): string {

    if (hasBuffer()) {

        return Buffer
            .from(binary, 'binary')
            .toString('base64');

    }

    return btoa(binary);

}

function decodeBase64(
    value: string,
): string {

    if (hasBuffer()) {

        return Buffer
            .from(value, 'base64')
            .toString('binary');

    }

    return atob(value);

}

function bytesToBinary(
    bytes: Uint8Array,
): string {

    let binary = '';

    for (const byte of bytes) {

        binary += String.fromCharCode(byte);

    }

    return binary;

}

function binaryToBytes(
    binary: string,
): Uint8Array {

    return Uint8Array.from(

        binary,

        c => c.charCodeAt(0),

    );

}

/**
 * Encode bytes as Base64.
 */
export function toBase64(
    bytes: Uint8Array,
): string {

    return encodeBase64(

        bytesToBinary(bytes),

    );

}

/**
 * Decode Base64.
 */
export function fromBase64(
    value: string,
): Uint8Array {

    return binaryToBytes(

        decodeBase64(value),

    );

}

/**
 * Encode bytes as Base64URL.
 */
export function toBase64Url(
    bytes: Uint8Array,
): string {

    return base64ToBase64Url(

        toBase64(bytes),

    );

}

/**
 * Decode Base64URL.
 */
export function fromBase64Url(
    value: string,
): Uint8Array {

    return fromBase64(

        base64UrlToBase64(value),

    );

}

/**
 * Convert Base64 → Base64URL.
 */
export function base64ToBase64Url(
    value: string,
): string {

    return value

        .replace(/\+/g, '-')

        .replace(/\//g, '_')

        .replace(/=+$/g, '');

}

/**
 * Convert Base64URL → Base64.
 */
export function base64UrlToBase64(
    value: string,
): string {

    let result = value

        .replace(/-/g, '+')

        .replace(/_/g, '/');

    while (result.length % 4 !== 0) {

        result += '=';

    }

    return result;

}

/**
 * Check whether a string is valid Base64.
 */
export function isBase64(
    value: string,
): boolean {

    try {

        fromBase64(value);

        return true;

    }

    catch {

        return false;

    }

}

/**
 * Check whether a string is valid Base64URL.
 */
export function isBase64Url(
    value: string,
): boolean {

    try {

        fromBase64Url(value);

        return true;

    }

    catch {

        return false;

    }

}