/**
 * Class representing a login token.
 * Used for transferring the token from the server to the client via
 * API as JSON
 */
export class Token {

    /** The token as string */
    token: string
    
}

/**
 * Describes the content (payload) of the authentication token
 */
export class TokenContent {

    /**
     * Id of the logged in user
     */
    _id: string

}