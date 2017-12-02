export class Rest {

    statusHandlers: { [id: number]: ((req: XMLHttpRequest) => boolean)[] } = {};

    addStatusHandler(statusCode: number, handler: (req: XMLHttpRequest) => boolean): void {
        if (!this.statusHandlers[statusCode]) this.statusHandlers[statusCode] = [];
        this.statusHandlers[statusCode].push(handler);
    }

    get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                this.handleReadyState(req, resolve);
            };
            req.open("GET", url, true);
            req.send();
        });
    }

    handleReadyState<T>(req: XMLHttpRequest, resolve: (value: T) => void): void {
        if (req.readyState !== 4) return;
        if (this.statusHandlers[req.status]) {
            let statusHandlers = this.statusHandlers[req.status];
            for (let i = 0; i < statusHandlers.length; i++) {
                let proceed = statusHandlers[i](req);
                if (!proceed) break;
            }
        } else if (req.status === 200) {
            let result = JSON.parse(req.responseText) as T;
            resolve(result);                    
        }
    }

    post<T>(url: string, entity: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                this.handleReadyState(req, resolve);
            };
            req.open("POST", url, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(entity));
        });
    }
    
}