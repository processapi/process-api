/**
 * SizesManager is a utility class for managing sizes and cumulative sizes.
 * It is useful for scenarios where you need to manage and calculate sizes of elements,
 * such as in virtualized lists or grids.
 *
 * Example usage:
 * 
 * // Initialize SizesManager with a count of 5 and a default size of 10
 * const sizesManager = new SizesManager(5, 10);
 * 
 * // Set specific sizes for indices
 * sizesManager.setSizes({ 1: 20, 3: 30 });
 * 
 * // Get the size at index 2
 * const sizeAtIndex2 = sizesManager.at(2);
 * 
 * // Get the cumulative size at index 4
 * const cumulativeSizeAtIndex4 = sizesManager.cumulative(4);
 * 
 * // Get the visible range based on scroll and container size
 * const visibleRange = sizesManager.getVisibleRange(50, 100);
 *
 * Public Methods:
 * - get length(): Get the number of sizes.
 * - get totalSize(): Get the total size.
 * - get defaultSize(): Get the default size.
 * - constructor(count, defaultSize = 0, sizes = null): Initialize the SizesManager.
 * - dispose(): Dispose of the SizesManager.
 * - setSizes(changes): Set the sizes for the given indices.
 *   - @param {Object} changes - The changes to make.
 * - getIndex(location): Get the index of the location in the sizes.
 *   - @param {number} location - The location to find the index for.
 *   - @returns {number} The index of the location.
 * - at(index): Get the size at the given index.
 *   - @param {number} index - The index to get the size for.
 *   - @returns {number} The size at the given index.
 * - set(index, value): Set the size at the given index and recalculate cumulative sizes.
 *   - @param {number} index - The index to set the size for.
 *   - @param {number} value - The new size value.
 * - sizeBetween(startIndex, endIndex): Get the size between two indices.
 *   - @param {number} startIndex - The start index.
 *   - @param {number} endIndex - The end index.
 *   - @returns {number} The size between the two indices.
 * - cumulative(index): Get the cumulative size at the given index.
 *   - @param {number} index - The index to get the cumulative size for.
 *   - @returns {number} The cumulative size at the given index.
 * - getVisibleRange(scroll, containerSize): Get the visible range based on scroll and container size.
 *   - @param {number} scroll - The scroll position.
 *   - @param {number} containerSize - The size of the container.
 *   - @returns {Object} The visible range with start and end indices.
 */

export class SizesManager {
    #sizes;
    #cumulativeSizes;
    #defaultSize;

    /**
     * Get the number of sizes.
     * @returns {number}
     */
    get length() {
        return this.#sizes.length;
    }

    /**
     * Get the total size.
     * @returns {number}
     */
    get totalSize() {
        return this.#cumulativeSizes[this.#cumulativeSizes.length - 1];
    }

    /**
     * Get the default size.
     * @returns {number}
     */
    get defaultSize() {
        return this.#defaultSize;
    }

    /**
     * Constructor to initialize the SizesManager.
     * @param {number} count - The number of sizes.
     * @param {number} [defaultSize=0] - The default size.
     * @param {Array<number>} [sizes=null] - The array of sizes.
     */
    constructor(count, defaultSize = 0, sizes = null) {
        this.#defaultSize = defaultSize;

        count = sizes?.length ?? count;

        this.#sizes = new Uint32Array(count);
        this.#cumulativeSizes = new Uint32Array(count);

        // 1. if we have default sizes then initialize the array with the default size
        if (defaultSize !== 0) {
            this.#fillSizes(count, defaultSize);
        }

        // 2. if we have sizes then initialize the array with the sizes
        if (sizes != null) {
            this.#fillWithSizes(sizes);
        }
    }

    /**
     * Dispose of the SizesManager.
     * @returns {null}
     */
    dispose() {
        this.#defaultSize = null;
        this.#sizes = null;
        this.#cumulativeSizes = null;
        return null;
    }

    /**
     * Fill the sizes and cumulative sizes with the default size.
     * @param {number} count - The number of sizes.
     * @param {number} defaultSize - The default size.
     */
    #fillSizes(count, defaultSize) {
        let total = 0;
        for (let i = 0; i < count; i++) {
            total += defaultSize;
            this.#sizes[i] = defaultSize;
            this.#cumulativeSizes[i] = total;
        }
    }

    /**
     * Given an array, set the sizes and accumulative sizes.
     * @param {Array<number>} sizes - Array of sizes.
     */
    #fillWithSizes(sizes) {
        let total = 0;
        for (let i = 0; i < sizes.length; i++) {
            total += sizes[i];
            this.#sizes[i] = sizes[i];
            this.#cumulativeSizes[i] = total;
        }
    }

    /**
     * Calculate the cumulative sizes from the sizes.
     */
    #recalculateSizes() {
        let total = 0;

        for (let i = 0; i < this.#sizes.length; i++) {
            total += this.#sizes[i];
            this.#cumulativeSizes[i] = total;
        }
    }

    /**
     * Set the sizes for the given indices.
     * This is used when you resize columns or rows.
     * The changes object is a dictionary where the key is the index and the value is the new size.
     *
     * Example:
     * {
     *     2: 20,
     *     3: 30
     * }
     *
     * @param {Object} changes - The changes to make.
     * @returns {SizesManager}
     */
    setSizes(changes) {
        for (const entry of Object.entries(changes)) {
            const index = parseInt(entry[0]);

            if (index < 0 || index >= this.#sizes.length) {
                throw new Error(`Invalid index: ${index}`);
            }

            this.#sizes[index] = entry[1];
        }

        this.#recalculateSizes();
        return this;
    }

    /**
     * Get the index of the location in the sizes.
     * This is used when you have a px location, and you need to find the index.
     * @param {number} location - The location to find the index for.
     * @returns {number} The index of the location.
     */
    getIndex(location) {
        return this.#cumulativeSizes.findIndex(size => location <= size);
    }

    top(index) {
        return this.#cumulativeSizes[index] - this.#sizes[index];
    }

    /**
     * Get the size at the given index.
     * @param {number} index - The index to get the size for.
     * @returns {number} The size at the given index.
     */
    at(index) {
        return this.#sizes[index];
    }

    /**
     * Set the size at the given index and recalculate cumulative sizes.
     * @param {number} index - The index to set the size for.
     * @param {number} value - The new size value.
     */
    set(index, value) {
        this.#sizes[index] = value;
        this.#recalculateSizes();
    }

    /**
     * Get the size between two indices.
     * @param {number} startIndex - The start index.
     * @param {number} endIndex - The end index.
     * @returns {number} The size between the two indices.
     */
    sizeBetween(startIndex, endIndex) {
        if (endIndex < startIndex) {
            return this.#sizes[endIndex];
        }

        return this.#cumulativeSizes[endIndex] - this.#cumulativeSizes[startIndex] + this.#sizes[startIndex];
    }

    /**
     * Get the cumulative size at the given index.
     * @param {number} index - The index to get the cumulative size for.
     * @returns {number} The cumulative size at the given index.
     */
    cumulative(index) {
        return this.#cumulativeSizes[index];
    }

    /**
     * Get the visible range based on scroll and container size.
     * @param {number} scroll - The scroll position.
     * @param {number} containerSize - The size of the container.
     * @returns {Object} The visible range with start and end indices.
     */
    getVisibleRange(scroll, containerSize) {
        let x1 = scroll;
        let x2 = scroll + containerSize;

        if (x2 > this.totalSize) {
            // calculate last page
            x2 = this.#cumulativeSizes[this.#sizes.length - 1];
            x1 = x2 - containerSize;
        }

        return {
            start: this.getIndex(x1),
            end: this.getIndex(x2)
        }
    }
}