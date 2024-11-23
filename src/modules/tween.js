export class TweenModule {
    static name = Object.freeze("canvas");

    /**
     * Linear Tween Function
     * Moves at a constant speed.
     * @param {number} t - Current time.
     * @param {number} b - Starting value.
     * @param {number} c - Change in value.
     * @param {number} d - Duration.
     * @returns {number} The calculated value at time `t`.
     * @example
     * const position = linear(0.5, 0, 100, 1); // position = 50
     */
    linear(t, b, c, d) {
        return c * (t / d) + b;
    }

    /**
     * Ease In Quad Tween Function
     * Accelerates over time.
     * @param {number} t - Current time.
     * @param {number} b - Starting value.
     * @param {number} c - Change in value.
     * @param {number} d - Duration.
     * @returns {number} The calculated value at time `t`.
     * @example
     * const position = easeInQuad(0.5, 0, 100, 1); // position = 25
     */
    easeInQuad(t, b, c, d) {
        t /= d;
        return c * t * t + b;
    }

    /**
     * Ease Out Quad Tween Function
     * Decelerates over time.
     * @param {number} t - Current time.
     * @param {number} b - Starting value.
     * @param {number} c - Change in value.
     * @param {number} d - Duration.
     * @returns {number} The calculated value at time `t`.
     * @example
     * const position = easeOutQuad(0.5, 0, 100, 1); // position = 75
     */
    easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    }

    /**
     * Ease In Out Quad Tween Function
     * Accelerates and then decelerates over time.
     * @param {number} t - Current time.
     * @param {number} b - Starting value.
     * @param {number} c - Change in value.
     * @param {number} d - Duration.
     * @returns {number} The calculated value at time `t`.
     * @example
     * const position = easeInOutQuad(0.5, 0, 100, 1); // position = 50
     */
    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    /**
     * Ease In Cubic Tween Function
     * Accelerates faster over time.
     * @param {number} t - Current time.
     * @param {number} b - Starting value.
     * @param {number} c - Change in value.
     * @param {number} d - Duration.
     * @returns {number} The calculated value at time `t`.
     * @example
     * const position = easeInCubic(0.5, 0, 100, 1); // position = 12.5
     */
    easeInCubic(t, b, c, d) {
        t /= d;
        return c * t * t * t + b;
    }

    /**
     * Ease Out Cubic Tween Function
     * Decelerates faster over time.
     * @param {number} t - Current time.
     * @param {number} b - Starting value.
     * @param {number} c - Change in value.
     * @param {number} d - Duration.
     * @returns {number} The calculated value at time `t`.
     * @example
     * const position = easeOutCubic(0.5, 0, 100, 1); // position = 87.5
     */
    easeOutCubic(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }

    /**
     * Ease In Out Cubic Tween Function
     * Accelerates and decelerates faster over time.
     * @param {number} t - Current time.
     * @param {number} b - Starting value.
     * @param {number} c - Change in value.
     * @param {number} d - Duration.
     * @returns {number} The calculated value at time `t`.
     * @example
     * const position = easeInOutCubic(0.5, 0, 100, 1); // position = 50
     */
    easeInOutCubic(t, b, c, d) {
        t /= d / 2; // Normalize time to [0, 2] range
        if (t < 1) {
            return c / 2 * t * t * t + b; // First half (ease in)
        }
        t -= 2;
        return c / 2 * (t * t * t + 2) + b; // Second half (ease out)
    }
}