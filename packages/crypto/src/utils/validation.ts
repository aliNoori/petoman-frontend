/**
 * ------------------------------------------------------------------
 * Validation Utilities
 * ------------------------------------------------------------------
 *
 * Shared validation helpers used throughout the Petoman
 * Crypto SDK.
 *
 * ------------------------------------------------------------------
 */

import { CRYPTO_CONSTANTS } from '../constants/crypto.constants';

import { CryptoAlgorithm } from '../enums/crypto-algorithm.enum';

/**
 * Assert that the value is a Uint8Array.
 */
function assertBytes(
    value: unknown,
    name: string,
): asserts value is Uint8Array {

    if (!(value instanceof Uint8Array)) {

        throw new TypeError(
            `${name} must be a Uint8Array.`,
        );

    }

}

/**
 * Validate AES-256 key.
 */
export function validateAESKey(
    key: Uint8Array,
): void {

    assertBytes(
        key,
        'AES key',
    );

    if (
        key.length !==
        CRYPTO_CONSTANTS.AES_KEY_LENGTH
    ) {

        throw new Error(
            `AES key must be ${CRYPTO_CONSTANTS.AES_KEY_LENGTH} bytes.`,
        );

    }

}

/**
 * Validate AES-GCM IV.
 */
export function validateIV(
    iv: Uint8Array,
): void {

    assertBytes(
        iv,
        'IV',
    );

    if (
        iv.length !==
        CRYPTO_CONSTANTS.GCM_IV_LENGTH
    ) {

        throw new Error(
            `IV must be ${CRYPTO_CONSTANTS.GCM_IV_LENGTH} bytes.`,
        );

    }

}

/**
 * Validate AES-GCM authentication tag.
 */
export function validateAuthTag(
    tag: Uint8Array,
): void {

    assertBytes(
        tag,
        'Authentication tag',
    );

    if (
        tag.length !==
        CRYPTO_CONSTANTS.GCM_TAG_LENGTH
    ) {

        throw new Error(
            `Authentication tag must be ${CRYPTO_CONSTANTS.GCM_TAG_LENGTH} bytes.`,
        );

    }

}

/**
 * Validate HKDF salt.
 */
export function validateSalt(
    salt: Uint8Array,
): void {

    assertBytes(
        salt,
        'HKDF salt',
    );

    if (
        salt.length <
        CRYPTO_CONSTANTS.HKDF_SALT_LENGTH
    ) {

        throw new Error(
            `HKDF salt must be at least ${CRYPTO_CONSTANTS.HKDF_SALT_LENGTH} bytes.`,
        );

    }

}

/**
 * Validate X25519 key.
 */
export function validateX25519Key(
    key: Uint8Array,
): void {

    assertBytes(
        key,
        'X25519 key',
    );

    if (
        key.length !==
        CRYPTO_CONSTANTS.X25519_KEY_LENGTH
    ) {

        throw new Error(
            `X25519 key must be ${CRYPTO_CONSTANTS.X25519_KEY_LENGTH} bytes.`,
        );

    }

}

/**
 * Validate crypto protocol version.
 */
export function validateCryptoVersion(
    version: number,
): void {

    if (
        version !==
        CRYPTO_CONSTANTS.CRYPTO_VERSION
    ) {

        throw new Error(
            'Unsupported crypto protocol version.',
        );

    }

}

/**
 * Validate encryption algorithm.
 */
export function validateAlgorithm(
    algorithm: CryptoAlgorithm,
): void {

    if (
        algorithm !==
        CryptoAlgorithm.AES_256_GCM
    ) {

        throw new Error(
            'Unsupported encryption algorithm.',
        );

    }

}

/**
 * Validate session key version.
 */
export function validateSessionVersion(
    version: number,
): void {

    if (
        !Number.isInteger(version)
    ) {

        throw new TypeError(
            'Session version must be an integer.',
        );

    }

    if (
        version <
        CRYPTO_CONSTANTS.INITIAL_SESSION_VERSION
    ) {

        throw new Error(
            'Session version is below the minimum supported version.',
        );

    }

    if (
        version >
        CRYPTO_CONSTANTS.MAX_SESSION_VERSION
    ) {

        throw new Error(
            'Session version exceeds the maximum supported version.',
        );

    }

}

/**
 * Validate encrypted payload.
 */
export function validatePayload(
    payload: Uint8Array,
): void {

    assertBytes(
        payload,
        'Payload',
    );

    if (
        payload.length === 0
    ) {

        throw new Error(
            'Payload cannot be empty.',
        );

    }

    if (
        payload.length >
        CRYPTO_CONSTANTS.MAX_MESSAGE_SIZE
    ) {

        throw new Error(
            'Payload exceeds the maximum allowed size.',
        );

    }

}