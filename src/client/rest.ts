export class Rest {

    private statusHandlers: { [id: number]: ((req: XMLHttpRequest) => boolean)[] } = {};

    addStatusHandler(statusCode: number, handler: (req: XMLHttpRequest) => boolean) {
        if (!this.statusHandlers[statusCode]) this.statusHandlers[statusCode] = [];
        this.statusHandlers[statusCode].push(handler);
    }

    get<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if (req.readyState !== 4) return;
                if (this.statusHandlers[req.status]) {
                    let statusHandlers = this.statusHandlers[req.status];
                    for (let i = 0; i < statusHandlers.length; i++) {
                        let proceed = statusHandlers[i](req); // TODO: Add request or so as parameter
                        if (!proceed) break;
                    }
                } else if (req.status === 200) {
                    let result = JSON.parse(req.responseText) as T;
                    resolve(result);                    
                }
            };
            req.open("GET", url, true);
            req.send();
        });
    }
}