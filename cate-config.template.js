module.exports = {

    /**
     * This variable is used by React. It's values are "development", "production", "test".
     */
    NODE_ENV: "development",

    /**
     * Cate WebAPI service configuration.
     */
    webAPIConfig: {
        /**
         * The URL of the Cate Web API service.
         */
        serviceURL: 'http://localhost:9090',
        /**
         * The file in which Cate WebAPI service stores its configuration while it is running.
         */
        serviceFile: 'webapi-info.json',
        /**
         * Additional process invocation options.
         * For details refer to https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
         */
        processOptions: {},
    },

    /**
     * Cate's user preferences file, default is ~/.cate/preferences.json
     */
    prefsFile: null,

    /**
     * List of Chrome DevTools extensions. See
     * - https://developer.chrome.com/devtools
     * - https://github.com/MarshallOfSound/electron-devtools-installer
     */
    devToolsExtensions: [
        // "EMBER_INSPECTOR",
        // "REACT_DEVELOPER_TOOLS",
        // "BACKBONE_DEBUGGER",
        // "JQUERY_DEBUGGER",
        // "ANGULARJS_BATARANG",
        // "VUEJS_DEVTOOLS",
        // "REDUX_DEVTOOLS",
        // "REACT_PERF",
    ],
};
