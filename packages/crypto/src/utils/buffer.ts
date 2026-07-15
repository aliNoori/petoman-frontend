/**
 * ------------------------------------------------------------------
 * Buffer Utilities
 * ------------------------------------------------------------------
 *
 * Shared buffer conversion helpers.
 *
 * ------------------------------------------------------------------
 */


/**
 * UTF-8 string → Uint8Array.
 */
export function utf8ToBytes(
    value: string,
): Uint8Array {

    return new TextEncoder().encode(
        value,
    );

}


/**
 * Uint8Array → UTF-8 string.
 */
export function bytesToUtf8(
    bytes: Uint8Array,
): string {

    return new TextDecoder().decode(
        bytes,
    );

}


/**
 * Clone bytes.
 */
export function cloneBytes(
    bytes: Uint8Array,
): Uint8Array {

    return Uint8Array.from(
        bytes,
    );

}


/**
 * Concatenate byte arrays.
 */
export function concatBytes(
    ...arrays: Uint8Array[]
): Uint8Array {

    const length =
        arrays.reduce(

            (
                total,
                current,
            ) =>
                total + current.length,

            0,

        );


    const result =
        new Uint8Array(
            length,
        );


    let offset = 0;


    for (const array of arrays) {

        result.set(
            array,
            offset,
        );


        offset += array.length;

    }


    return result;

}


/**
 * Compare two byte arrays.
 *
 * Constant-time comparison.
 */
export function equalBytes(
    left: Uint8Array,
    right: Uint8Array,
): boolean {


    if (
        left.length !== right.length
    ) {

        return false;

    }


    let diff = 0;


    for (
        let i = 0;
        i < left.length;
        i++
    ) {

        const leftByte =
            left[i] ?? 0;


        const rightByte =
            right[i] ?? 0;


        diff |=
            leftByte ^ rightByte;

    }


    return diff === 0;

}


/**
 * Zeroize sensitive bytes.
 *
 * Best effort only.
 */
export function wipeBytes(
    bytes?: Uint8Array,
): void {

    if (!bytes) {

        return;

    }


    bytes.fill(0);

}


/**
 * Check whether the value is a Uint8Array.
 */
export function isBytes(
    value: unknown,
): value is Uint8Array {

    return value instanceof Uint8Array;

}

export function toArrayBuffer(
    bytes: Uint8Array,
): ArrayBuffer {

    return bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
    ) as ArrayBuffer;

}