class FilesModule {
    /**
     * @property name
     * @type {string}
     * @static
     * @description Name of the module
     */
    static name = Object.freeze("files");

    /**
     * @method load_files
     * @description Load files for a given extension using the file open dialog.
     * @param args
     * @returns {Promise<void>}
     */
    static async load_files(args) {
        const { ext } = args;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ext;
        input.multiple = true;
        input.click();

        return new Promise((resolve) => {
            input.onchange = () => {
                resolve(input.files);
            };
        });
    }
}

export { FilesModule };