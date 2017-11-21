
/**
 * Initialization settings for the application
 */
export class InitOptions {
    
    /**
     * Absolute or relative path (relative to app entry point) where the static
     * files like HTML files, images or styles are stored. This path is mounted
     * at the root URL and must not contain an "api" folder or an "index.html" file
     * because these URLs are reserved by the application.
     * @default /public
     */
    publicPath?: string = '/public'

    /**
     * Absolute or relative path where the compiled client javascript files are located.
     * @default /dist/client
     */
    jsPath?: string = '/dist/client'

    /**
     * Path relative to the app entry point, where additional modules are stored.
     * This is used only when the app defines further modules.
     * Normally this is in the  'modules' folder under '/src/server'.
     * When not set, no additional modules will be loaded
     */
    modulesPath?: string

    /**
     * Port where the application should listen on
     * @default 80
     */
    port?: number = 80

    /**
     * URL part, where the APIs are accessible.
     * @default /api
     */
    apiUrl?: string = '/api'

    /**
     * URL part where the compiled javascript files can be accessed.
     * @default /js
     */
    jsUrl?: string = '/js'

}
