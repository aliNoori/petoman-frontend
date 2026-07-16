/**
 * ------------------------------------------------------------------
 * Crypto Algorithm
 * ------------------------------------------------------------------
 *
 * Supported encryption algorithms used by the Petoman
 * cryptographic protocol.
 *
 * ------------------------------------------------------------------
 */

export enum CryptoAlgorithm {

    /**
     * AES-256-GCM
     *
     * Authenticated encryption.
     *
     * Used for:
     * - Chat messages
     * - Files
     * - Images
     * - Voice
     * - Video
     */
    AES_256_GCM = 'AES-256-GCM',

}