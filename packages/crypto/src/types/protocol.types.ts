/**
 * ------------------------------------------------------------------
 * Protocol Types
 * ------------------------------------------------------------------
 *
 * Shared protocol types used by the high-level Petoman
 * cryptographic workflow.
 *
 * ------------------------------------------------------------------
 */

import type { CryptoEnvelope } from '../interfaces';
import type { DeviceKey } from '../interfaces';
import type { EncryptedSessionKey } from '../interfaces';
import type {AttachmentId, ConsultationId, DeviceId} from "./crypto.types";
import {CryptoAlgorithm} from "../enums";

/**
 * Device registration payload.
 */
export interface DeviceRegistration {

    /**
     * Device identifier.
     */
    deviceId: DeviceId;

    /**
     * Device name.
     */
    deviceName: string;

    /**
     * Published public keys.
     */
    keys: DeviceKey[];

}

/**
 * Consultation session initialization.
 */
export interface ConsultationSession {

    consultationId: string;

    deviceId: string;

    sessionVersion: number;

    /**
     * Current AES session key.
     *
     * Should only remain in memory while required.
     */
    sessionKey: Uint8Array;

    /**
     * HKDF salt used to derive the session key.
     */
    salt: Uint8Array;

    /**
     * Session creation time.
     */
    createdAt: Date;

}

/**
 * Encrypted chat message.
 */
export interface EncryptedMessage {

    /**
     * Consultation identifier.
     */
    consultationId: ConsultationId;

    /**
     * Sender device identifier.
     */
    senderDeviceId: string;

    /**
     * Encrypted payload.
     */
    payload: CryptoEnvelope;

}

export interface EncryptedAttachment {

    attachmentId: string;

    consultationId: string;

    sessionVersion: number;

    senderDeviceId: string;

    fileName: string;

    mimeType: string;

    fileSize: number;

    algorithm: CryptoAlgorithm;

    cryptoVersion: number;

    payload: CryptoEnvelope;

    hkdfSalt: string;

    createdAt: string;

}

/*export interface EncryptedAttachment {

    /!**
     * Attachment identifier.
     *!/
    attachmentId: string;

    /!**
     * Consultation identifier.
     *!/
    consultationId: string;

    /!**
     * Session key version.
     *!/
    sessionVersion: number;

    /!**
     * Sender device.
     *!/
    senderDeviceId: string;

    /!**
     * Original filename.
     *
     * Can optionally be encrypted by upper layers.
     *!/
    fileName: string;

    /!**
     * MIME type.
     *!/
    mimeType: string;

    /!**
     * File size.
     *!/
    fileSize: number;

    /!**
     * Encryption algorithm.
     *!/
    algorithm: CryptoAlgorithm;

    /!**
     * Crypto version.
     *!/
    cryptoVersion: number;

    /!**
     * Encrypted payload.
     *!/
    payload: CryptoEnvelope;

    /!**
     * HKDF Salt.
     *!/
    hkdfSalt: string;

    /!**
     * Created time.
     *!/
    createdAt: string;

}*/