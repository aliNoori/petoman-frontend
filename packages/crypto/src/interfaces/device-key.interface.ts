/**
 * ------------------------------------------------------------------
 * Device Key
 * ------------------------------------------------------------------
 *
 * Public key published by a registered device.
 *
 * Private keys NEVER appear in this interface.
 *
 * ------------------------------------------------------------------
 */

import { DeviceKeyType } from '../enums/device-key-type.enum';
import { KeyAlgorithm } from '../enums/key-algorithm.enum';

export interface DeviceKey {

    /**
     * Device key identifier.
     */
    id: string;

    /**
     * Device identifier.
     */
    deviceId: string;

    /**
     * Identity / Signed PreKey / One-Time PreKey.
     */
    type: DeviceKeyType;

    /**
     * Public-key algorithm.
     */
    algorithm: KeyAlgorithm;

    /**
     * Public key.
     *
     * Base64URL.
     */
    publicKey: string;

    /**
     * Signature for Signed PreKey.
     *
     * Base64URL.
     *
     * Undefined for other key types.
     */
    signature?: string;

    /**
     * Version number.
     */
    version: number;

    /**
     * Whether the key has been consumed.
     *
     * Applies mainly to One-Time PreKeys.
     */
    consumed?: boolean;

    /**
     * Creation time ISO-8601 UTC.
     */
    createdAt: string;

    /**
     * Expiration time ISO-8601 UTC.
     */
    expiresAt?: string;

}