/**
 * ------------------------------------------------------------------
 * HKDF Info Constants
 * ------------------------------------------------------------------
 *
 * RFC 5869
 *
 * HKDF "info" values used for domain separation.
 *
 * Every derived key MUST use a unique context string.
 *
 * IMPORTANT
 * ----------
 * Never reuse an HKDF info value for different purposes.
 *
 * ------------------------------------------------------------------
 */

export const HKDF_INFO = {

    /**
     * Consultation session AES key.
     */
    SESSION: 'petoman/session',

    /**
     * Chat message encryption.
     */
    MESSAGE: 'petoman/message',

    ATTACHMENT: 'petoman/attachment',

    /**
     * File encryption.
     */
    FILE: 'petoman/file',

    /**
     * Image encryption.
     */
    IMAGE: 'petoman/image',

    /**
     * Voice encryption.
     */
    VOICE: 'petoman/voice',

    /**
     * Video encryption.
     */
    VIDEO: 'petoman/video',

    /**
     * Backup encryption.
     */
    BACKUP: 'petoman/backup',

    /**
     * Attachment metadata.
     */
    METADATA: 'petoman/metadata',

    /**
     * Device identity.
     */
    DEVICE: 'petoman/device',

    IDENTITY: 'petoman/identity',

    /**
     * Device registration.
     */
    REGISTRATION: 'petoman/registration',

    /**
     * Consultation creation.
     */
    CONSULTATION: 'petoman/consultation',

    /**
     * Session key wrapping.
     */
    SESSION_WRAP: 'petoman/session-wrap',

    /**
     * Future key rotation.
     */
    KEY_ROTATION: 'petoman/key-rotation',

    SIGNED_PREKEY: 'petoman/signed-prekey',

    ONE_TIME_PREKEY: 'petoman/one-time-prekey',

    PAIRING: 'petoman/pairing',

    SIGNATURE: 'petoman/signature',

    RECOVERY: 'petoman/recovery',

} as const;

export type HKDFInfo =
    typeof HKDF_INFO[keyof typeof HKDF_INFO];