/**
 * ------------------------------------------------------------------
 * Device Key Type
 * ------------------------------------------------------------------
 *
 * Types of public keys stored for every registered device.
 *
 * ------------------------------------------------------------------
 */

export enum DeviceKeyType {

    /**
     * Long-term identity key.
     *
     * Never rotated unless the device is re-registered.
     */
    IDENTITY = 'IDENTITY',

    SIGNING = 'SIGNING',

    /**
     * Medium-term signed pre-key.
     *
     * Rotated periodically.
     */
    SIGNED_PRE_KEY = 'SIGNED_PRE_KEY',

    /**
     * One-time pre-key.
     *
     * Consumed once during session establishment.
     */
    ONE_TIME_PRE_KEY = 'ONE_TIME_PRE_KEY',


}