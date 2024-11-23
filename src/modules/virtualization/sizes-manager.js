export class SizesManager {
    #sizes;
    #cumulativeSizes;
    #defaultSize;

    get length() {
        return this.#sizes.length;
    }

    get totalSize() {
        return this.#cumulativeSizes[this.#cumulativeSizes.length - 1];
    }

    get defaultSize() {
        return this.#defaultSize;
    }

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

    dispose() {
        this.#defaultSize = null;
        this.#sizes = null;
        this.#cumulativeSizes = null;
        return null;
    }

    /**
     * Fill the sizes and cumulative sizes with the default size.
     * @param count
     * @param defaultSize
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
     * @param sizes {Array} - array of sizes
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
     * @param changes {Object} The changes to make.
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
     * @param location {number} The location to find the index for.
     * @returns {number} The index of the location.
     */
    getIndex(location) {
        return this.#cumulativeSizes.findIndex(size => location <= size);
    }

    at(index) {
        return this.#sizes[index];
    }

    set(index, value) {
        this.#sizes[index] = value;
        this.#recalculateSizes();
    }

    sizeBetween(startIndex, endIndex) {
        if (endIndex < startIndex) {
            return this.#sizes[endIndex];
        }

        return this.#cumulativeSizes[endIndex] - this.#cumulativeSizes[startIndex] + this.#sizes[startIndex];
    }

    cumulative(index) {
        return this.#cumulativeSizes[index];
    }

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