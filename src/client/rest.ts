/**
 * Low level communications between client and server vie HTTP requests.
 * Should not be used directly but rather use the WebbApp.api<Type> API
 * functions to communicate with the server.
 * The API functions use this layer for server communication.
 */
export class Rest {

    /**
     * List of all status handlers registered for specific HTTP status codes
     */
    statusHandlers: { [id: number]: ((req: XMLHttpRequest) => boolean)[] } = {};

    /**
     * Register a handler for a specific HTTP status code. Once registered, the handler
     * is called on each request, when the return status equals the given one.
     * Please use WebApp.addStatusHandler(), which is a delegate, to use this method.
     * 
     * @param statusCode HTTP status code to listen for
     * @param handler Handler function which is called when the given status is returned.
     *                This function gets the request as parameter and needs to return true
     *                when the request should be processed further or false when not.
     */
    addStatusHandler(statusCode: number, handler: (req: XMLHttpRequest) => boolean): void {
        if (!this.statusHandlers[statusCode]) this.statusHandlers[statusCode] = [];
        this.statusHandlers[statusCode].push(handler);
    }

    delete<T>(url: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                // Handle status codes and parse response
                this.handleReadyState(req, resolve, reject);
            };
            req.open("DELETE", url, true);
            req.send();
        });
    }


    /**
     * Performs a GET request and returns the response from the server casted
     * to the given generic type. It is expected that the requested URL returns a JSON
     * structure which matches to the given type.
     * 
     * @param url URL to send the request to.
     */
    get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                // Handle status codes and parse response
                this.handleReadyState(req, resolve, reject);
            };
            req.open("GET", url, true);
            req.send();
        });
    }

    /**
     * Called when the server sent a (partial) response. Analyzes the status code
     * and informs the registered status code handlers. Also parses the response
     * to the desired type and calls the Promise resolve function with the parsed
     * response as parameter.
     * 
     * @param req Request to parse
     * @param resolve Promise's resolve function to call with the response
     */
    handleReadyState<T>(req: XMLHttpRequest, resolve: (value?: T) => void, reject: (code: number) => void): void {
        // Ignore partial results
        if (req.readyState !== 4) return;
        if (this.statusHandlers[req.status]) {
            let statusHandlers = this.statusHandlers[req.status];
            for (let i = 0; i < statusHandlers.length; i++) {
                let proceed = statusHandlers[i](req);
                // Cancel further processing when on status handler returned false
                if (!proceed) break;
            }
        } else if (req.status === 200) {
            // Parse the request when the result is OK
            let result = req.responseText === "OK" ? undefined : JSON.parse(req.responseText) as T;
            resolve(result);                    
        } else {
            reject(req.status);
        }
    }

    /**
     * Send an entity via POST request to the given URL and returns the response
     * which must be of the same type as the sent entity. Normally POST APIs return
     * the updated or inserted entity.
     * 
     * @param url URL to send the entity to
     * @param entity Entity to send
     */
    post<T>(url: string, entity: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                this.handleReadyState(req, resolve, reject);
            };
            req.open("POST", url, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(entity));
        });
    }
    
}

export class GenericRest {

    statusHandlers: { [id: number]: ((req: XMLHttpRequest) => boolean)[] } = {};

    addStatusHandler(statusCode: number, handler: (req: XMLHttpRequest) => boolean): void {
        if (!this.statusHandlers[statusCode]) this.statusHandlers[statusCode] = [];
        this.statusHandlers[statusCode].push(handler);
    }

    delete(url: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                // Handle status codes and parse response
                this.handleReadyState(req, resolve, reject);
            };
            req.open("DELETE", url, true);
            req.send();
        });
    }

    get(url: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                // Handle status codes and parse response
                this.handleReadyState(req, resolve, reject);
            };
            req.open("GET", url, true);
            req.send();
        });
    }

    handleReadyState(req: XMLHttpRequest, resolve: (value?: object) => void, reject: (code: number) => void): void {
        // Ignore partial results
        if (req.readyState !== 4) return;
        if (this.statusHandlers[req.status]) {
            let statusHandlers = this.statusHandlers[req.status];
            for (let i = 0; i < statusHandlers.length; i++) {
                let proceed = statusHandlers[i](req);
                // Cancel further processing when on status handler returned false
                if (!proceed) break;
            }
        } else if (req.status === 200) {
            // Parse the request when the result is OK
            let result = req.responseText === "OK" ? undefined : JSON.parse(req.responseText) as object;
            resolve(result);                    
        } else {
            reject(req.status);
        }
    }

    post(url: string, entity: object): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                this.handleReadyState(req, resolve, reject);
            };
            req.open("POST", url, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(entity));
        });
    }
    
}