/**
 * ------------------------------------------------------------------
 * Key Pair
 * ------------------------------------------------------------------
 *
 * Generic asymmetric key pair used throughout the Petoman
 * cryptographic SDK.
 *
 * IMPORTANT
 * ----------
 * The private key must never leave the client device.
 *
 * ------------------------------------------------------------------
 */

import { KeyAlgorithm } from '../enums/key-algorithm.enum';

export interface KeyPair {

    /**
     * Key algorithm.
     */
    algorithm: KeyAlgorithm;

    /**
     * Private key.
     *
     * Raw bytes encoded as Base64URL.
     */
    privateKey: string;

    /**
     * Public key.
     *
     * Raw bytes encoded as Base64URL.
     */
    publicKey: string;

    /**
     * Optional key version.
     */
    version?: number;

    /**
     * Creation timestamp ISO-8601 UTC.
     */
    createdAt?: string;

    /**
     * Optional expiration timestamp ISO-8601 UTC.
     */
    expiresAt?: string;

}