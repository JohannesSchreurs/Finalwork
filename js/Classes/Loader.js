//Custom loader written by the people of Base Design (Maxime Palau, https://twitter.com/maximepalau).
//This loads in all the scripts from one location, rather than using multiple <script> tags

// ====================================================================== //
// Loader
// ====================================================================== //

/**
 * @class Loader
 *     @method attachConfig
 *     @method initModules
 *     @method registerPolyfills
 *     @method loadPolyfills
 *     @method loadScript
 *
 * Manages the initialization of the modules, the loading of scripts and
 * the loading of attached polyfills (only once) when an error occurs.
 */
class Loader {
    /**
     * @method attachConfig
     *
     * Defines the default properties of the class.
     */
    static attachConfig () {
        this.modules = [];

        this.polyfills = {
            path: '',
            state: ''
        };
    }

    /**
     * @method initModules
     *
     * Initializes all of the attached modules.
     *
     * 1. Initializes each module one by one and removes it from the list of
     *    modules to initialize.
     * 2. Loads the polyfills when an error is caught.
     *    2.1. Initializes each of the non-initialized modules one by one.
     * 3. Cleans the modules list.
     */
    static initModules () {
        try {
            /* [1] */
            (this.modules || []).forEach((module, index) => {
                module();
                this.modules[index] = null;
            });

            this.modules = [];
        } catch (firstCaughtError) {
            console.warn('A module silently failed. Polyfills are being loaded.', firstCaughtError);

            /* [2] */
            this.loadPolyfills().then(() => {
                this.modules.forEach((module, index) => {
                    try {
                        /* [2.1] */
                        if (!module) return;
                        module();
                        this.modules[index] = null;
                    } catch (secondCaughtError) {
                        console.warn('A module silently failed a second time.', secondCaughtError);
                    }
                })
            });

            /* [3] */
            this.modules.filter(module => !!module);
        }
    }

    /**
     * @method registerPolyfills
     * @param {string} path
     *
     * Registers the polyfills path to call when an error occurs.
     */
    static registerPolyfills (path) {
        this.polyfills.path = path;
    }

    /**
     * @method registerModules
     * @param {functions} modules
     *
     * Registers the modules to initialize.
     */
    static registerModules (...modules) {
        this.modules = [ ...this.modules, ...modules ];
    }

    /**
     * @method loadPolyfills
     * @return {object}
     *
     * Loads the registered polyfills as Promise.
     *
     * Example: `loadPolyfills.then(callback)`
     *
     * 1. The following will run only if the polyfills aren’t loaded yet.
     *    1.1. Loads the polyfills using the `loadScript` method.
     *    1.2. Once loaded, marks the polyfills as loaded and triggers
     *         any callback provided. Let’s capture any error.
     *    1.3. If the polyfills are loading, saves the callback for later,
     *         otherwise executes it immediately.
     * 2. If the polyfills are loading because of another module,
     *    add the callback to the end of the list of modules to execute it
     *    after all modules are initialized.
     */
    static loadPolyfills () {
        if (this.polyfills.path.length && this.polyfills.state === '') { /* [1] */
            /* [1.1] */
            this.polyfills.state = 'loading';
            const polyfillsPromise = this.loadScript(this.polyfills.path, { polyfills: false });

            /* [1.2] */
            let promiseCallback = () => {};
            polyfillsPromise.then(() => {
                this.polyfills.state = 'loaded';
                try {
                    promiseCallback();
                } catch (e) {
                    console.warn('Module initialization aborted.', e);
                }
            });

            /* [1.3] */
            return {
                then: callback => {
                    if (this.polyfills.state === 'loading') {
                        promiseCallback = callback;
                    } else {
                        try {
                            callback();
                        } catch (e) {
                            console.warn('Module initalization aborted.', e);
                        }
                    }
                }
            };
        } else {
            /* [2] */
            return {
                then: callback => {
                    if (this.polyfills.state === 'loading') {
                        this.modules.push(callback);
                    }
                }
            };
        }
    }

    /**
     * @method loadScript
     * @param {string} path - path to the script, including filename.
     * @param {object} options
     *     @property {boolean} polyfills (optional) - enables polyfills to be loaded.
     * @return {object}
     *
     * Loads the given script as Promise and subsequently loads the polyfills
     * if an error occurs. The Promise allows a callback once loaded.
     *
     * Example: `loadScript.then(callback)`
     *
     * 1. Creates a script element and appends it to the document.
     * 2. Wraps the callback into a safe function that will catch any error.
     * 3. Once the script has loaded, executes the callback.
     */
    static loadScript (path, { polyfills = true } = {}) {
        /* [1] */
        const script = document.createElement('script');
        script.src = path;

        let scriptLoaded = false;
        script.onload = () => scriptLoaded = true;

        document.body.appendChild(script);

        return {
            then: callback => {
                /* [2] */
                const safeCallback = () => {
                    try {
                        callback();
                    } catch (e) {
                        if (!polyfills) return;
                        this.loadPolyfills().then(callback);
                    }
                };

                /* [3] */
                if (scriptLoaded) return safeCallback();
                script.onload = safeCallback;
            }
        };
    }
}

Loader.attachConfig();

export default Loader;
