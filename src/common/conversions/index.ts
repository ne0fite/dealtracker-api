/**
 * Returns X / Y.
 * Returns null if either x or y is null or if y is 0.
 * @param x
 * @param y
 * @returns number | null
 */
export function toRatio(x?: number | null, y?: number | null): number | null {
    if (x == null || y == null || y === 0) {
        return null;
    }
    const value = x / y;
    if (isNaN(value)) {
        return null;
    }
    return value;
}

/**
 * Returns X * Y.
 * Returns null if either x or y is null.
 * @param x
 * @param y
 * @returns number | null
 */
export function fromRatio(x?: number | null, y?: number | null): number | null {
    if (x == null || y == null) {
        return null;
    }
    const value = x * y;
    if (isNaN(value)) {
        return null;
    }
    return value;
}

/**
 * Returns X as a percent of Y (i.e., x / y * 100).
 * Returns null if either x or y is null or if y is 0.
 * @param x
 * @param y
 * @returns number | null
 */
export function toPercent(x?: number | null, y?: number | null): number | null {
    const value = toRatio(x, y);
    if (value == null || isNaN(value)) {
        return null;
    }
    return value * 100;
}

/**
 * Returns the x percent of y (i.e., (x / 100) * y).
 * Returns null if either x or y is null.
 * @param x
 * @param y
 * @returns number | null
 */
export function fromPercent(x?: number | null, y?: number | null): number | null {
    if (x == null || y == null) {
        return null;
    }
    const value = fromRatio(x / 100, y);
    if (value == null || isNaN(value)) {
        return null;
    }
    return value;
}

/**
 * Rounds the number to a fixed precision.
 * Returns null if number is null or NaN.
 * @param number
 * @param precision
 * @returns
 */
export function toFixed(number?: number | null, precision: number = 0): number | null {
    if (number == null || isNaN(number)) {
        return null;
    }
    const factor = 10 ** precision;
    return Math.round(number * factor) / factor;
}

/**
 * Return the value or the min value if value < min or the max value if value > max.
 * @param value
 * @param min
 * @param max
 * @returns the value or the min or max if out of range
 */
export function withinRange(value: number, min: number, max: number) {
    return Math.max(Math.min(value, max), min);
}
