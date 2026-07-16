/**
 * ------------------------------------------------------------------
 * Key Algorithm
 * ------------------------------------------------------------------
 *
 * Supported public-key algorithms used by the Petoman
 * end-to-end encryption protocol.
 *
 * ------------------------------------------------------------------
 */

export enum KeyAlgorithm {

    /**
     * X25519
     *
     * Elliptic Curve Diffie-Hellman
     *
     * Used for:
     * - Identity Keys
     * - Signed PreKeys
     * - One-Time PreKeys
     * - Shared Secret generation
     */
    X25519 = 'X25519',

    /**
     * Ed25519
     *
     * Digital signatures.
     *
     * Used for:
     * - Signed PreKey signatures
     * - Device identity verification
     * - Registration challenge signatures
     */
    ED25519 = 'Ed25519',

}