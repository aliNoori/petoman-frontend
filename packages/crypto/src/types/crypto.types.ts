/**
 * ------------------------------------------------------------------
 * Crypto Types
 * ------------------------------------------------------------------
 *
 * Common reusable type aliases used throughout the
 * Petoman Crypto SDK.
 *
 * ------------------------------------------------------------------
 */

import { CryptoAlgorithm } from '../enums';
import { DeviceKeyType } from '../enums';
import { KeyAlgorithm } from '../enums';

/**
 * Base64 encoded string.
 */
export type Base64String =
    string & { readonly __base64: unique symbol };

/**
 * Base64URL encoded string.
 */
export type Base64UrlString =
    string & { readonly __base64url: unique symbol };

/**
 * UUID string.
 */
export type UUID =
    string & { readonly __uuid: unique symbol };

/**
 * Unix timestamp (milliseconds).
 */
export type UnixTimestamp = number;

/**
 * Crypto protocol version.
 */
export type CryptoVersion = number;

/**
 * Session key version.
 */
export type SessionKeyVersion = number;

/**
 * Device key version.
 */
export type DeviceKeyVersion = number;

/**
 * AES key represented as raw bytes.
 */
export type AESKey = Uint8Array;

/**
 * Shared secret represented as raw bytes.
 */
export type SharedSecret = Uint8Array;

/**
 * HKDF salt represented as raw bytes.
 */
export type HKDFSalt = Uint8Array;

/**
 * Initialization Vector.
 */
export type IV = Uint8Array;

/**
 * Authentication Tag.
 */
export type AuthTag = Uint8Array;

/**
 * Binary payload.
 */
export type BinaryData = Uint8Array;

/**
 * Supported text encodings.
 */
export type TextEncoding =
    | 'utf8'
    | 'binary';

/**
 * Supported compression algorithms.
 */
export type CompressionAlgorithm =
    | 'none'
    | 'gzip'
    | 'brotli';

/**
 * Supported crypto algorithms.
 */
export type SupportedCryptoAlgorithm =
    CryptoAlgorithm;

/**
 * Supported key algorithms.
 */
export type SupportedKeyAlgorithm =
    KeyAlgorithm;

/**
 * Supported device key types.
 */
export type SupportedDeviceKeyType =
    DeviceKeyType;


export type ISODateString = string;

export type DeviceId = string;

export type ConsultationId = string;

export type SessionId = string;

export type AttachmentId = string;