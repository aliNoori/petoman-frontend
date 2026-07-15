/**
 * ------------------------------------------------------------------
 * Crypto Constants
 * ------------------------------------------------------------------
 *
 * Shared cryptographic constants used by all Petoman clients.
 *
 * These values MUST remain identical across:
 *
 * - Nuxt
 * - Vue
 * - Android
 * - iOS
 * - Electron
 * - Backend (validation only)
 *
 * ------------------------------------------------------------------
 */

export const CRYPTO_CONSTANTS = Object.freeze({

    /**
     * Protocol version.
     */
    CRYPTO_VERSION: 1,

    KEY_VERSION: 1,

    INITIAL_KEY_VERSION: 1,

    // -----------------------------------------------------------------
    // Algorithms
    // -----------------------------------------------------------------

    AES_ALGORITHM: 'AES-256-GCM',

    HKDF_ALGORITHM: 'HKDF-SHA256',

    SIGNATURE_ALGORITHM: 'Ed25519',

    KEY_EXCHANGE_ALGORITHM: 'X25519',

    HASH_ALGORITHM: 'SHA-256',

    // -----------------------------------------------------------------
    // AES
    // -----------------------------------------------------------------

    /**
     * AES-256 key length.
     */
    AES_KEY_LENGTH: 32,

    /**
     * AES-GCM IV length.
     *
     * NIST recommendation.
     */
    GCM_IV_LENGTH: 12,

    /**
     * AES-GCM Authentication Tag.
     */
    GCM_TAG_LENGTH: 16,

    // -----------------------------------------------------------------
    // HKDF
    // -----------------------------------------------------------------

    /**
     * HKDF output length.
     */
    HKDF_OUTPUT_LENGTH: 32,

    /**
     * Minimum salt length.
     */
    HKDF_SALT_LENGTH: 32,

    // -----------------------------------------------------------------
    // Keys
    // -----------------------------------------------------------------

    X25519_KEY_LENGTH: 32,

    ED25519_PUBLIC_KEY_LENGTH: 32,

    ED25519_PRIVATE_KEY_LENGTH: 32,

    ED25519_SIGNATURE_LENGTH: 64,

    // -----------------------------------------------------------------
    // Device
    // -----------------------------------------------------------------

    /**
     * Number of One-Time PreKeys
     * generated during registration.
     */
    DEFAULT_ONE_TIME_PREKEY_COUNT: 100,

    /**
     * When remaining keys are below this value,
     * the client should upload new ones.
     */
    ONE_TIME_PREKEY_REFILL_THRESHOLD: 20,

    SIGNED_PREKEY_ROTATION_DAYS: 30,

    SESSION_ROTATION_HOURS: 24,

    // -----------------------------------------------------------------
    // Session
    // -----------------------------------------------------------------

    /**
     * Initial session version.
     */
    INITIAL_SESSION_VERSION: 1,

    /**
     * Maximum supported session version.
     */
    MAX_SESSION_VERSION: Number.MAX_SAFE_INTEGER,

    // -----------------------------------------------------------------
    // Challenge
    // -----------------------------------------------------------------

    /**
     * Registration challenge size.
     */
    CHALLENGE_LENGTH: 32,

    /**
     * Challenge expiration (minutes).
     */
    CHALLENGE_EXPIRATION_MINUTES: 5,

    /**
     * Maximum verification attempts.
     */
    MAX_CHALLENGE_ATTEMPTS: 5,

    // -----------------------------------------------------------------
    // Limits
    // -----------------------------------------------------------------

    MAX_MESSAGE_SIZE: 1024 * 1024,

    MAX_FILE_SIZE: 250 * 1024 * 1024,

    MAX_AAD_SIZE: 4096,

    ATTACHMENT_CHUNK_SIZE: 1024 * 1024,

    FINGERPRINT_HASH: 'SHA-256',

    DEFAULT_ENCODING: 'utf-8',

});