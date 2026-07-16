/**
 * ------------------------------------------------------------------
 * Encrypted Session Key
 * ------------------------------------------------------------------
 *
 * One encrypted AES session key for one recipient device.
 *
 * The AES session key itself is NEVER stored in plaintext.
 * Each device receives its own encrypted copy.
 *
 * ------------------------------------------------------------------
 */
import type {HKDFInfo} from "../constants/hkdf-info.constants";

export interface EncryptedSessionKey {

    /**
     * Consultation session identifier.
     */
    sessionId: string;

    /**
     * Recipient device identifier.
     */
    deviceId: string;

    /**
     * Device public key identifier
     * used to wrap the session key.
     */
    deviceKeyId: string;

    /**
     * Session key version.
     */
    sessionVersion: number;

    /**
     * Encrypted AES session key.
     *
     * Base64URL.
     */
    encryptedSessionKey: string;

    /**
     * AES-GCM IV.
     *
     * Base64URL.
     */
    iv: string;

    /**
     * AES-GCM Authentication Tag.
     *
     * Base64URL.
     */
    authTag: string;

    /**
     * HKDF salt.
     *
     * Base64URL.
     */
    hkdfSalt: string;

    /**
     * HKDF info/context.
     */
    hkdfInfo: HKDFInfo;

    /**
     * Recipient key version.
     */
    recipientKeyVersion: number;

    /**
     * Creation timestamp ISO-8601 UTC.
     */
    createdAt?: string;

}