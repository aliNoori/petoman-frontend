/**
 * ------------------------------------------------------------------
 * Crypto Envelope
 * ------------------------------------------------------------------
 *
 * Standard encrypted payload exchanged between all Petoman clients.
 *
 * This interface is transport-independent and can be used over:
 *
 * - REST
 * - WebSocket
 * - Push Notifications
 * - Offline Sync
 *
 * The backend stores this object without ever decrypting it.
 *
 * ------------------------------------------------------------------
 */

import { CryptoAlgorithm } from '../enums';

export interface CryptoEnvelope {

    /**
     * Crypto protocol version
     */
    cryptoVersion:number;


    /**
     * Encryption algorithm
     */
    algorithm:CryptoAlgorithm;


    /**
     * Session key version
     */
    keyVersion:number;


    /**
     * Cipher text
     */
    cipherText:string;


    /**
     * Initialization vector
     */
    iv:string;


    /**
     * Authentication tag
     */
    authTag:string;


    /**
     * Additional authenticated data
     */
    aad?:string;


    /**
     * Original encoding
     */
    encoding:
        'binary'
        |
        'utf8';

}