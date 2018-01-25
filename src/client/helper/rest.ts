import { Token } from "../../common/types/token";

export class Rest {

    static get<TEXPECT>(url: string): Promise<TEXPECT> {
        return new Promise<TEXPECT>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = (evt) => {
                if (req.readyState !== 4) return;
                if (req.status === 200) resolve(JSON.parse(req.responseText) as TEXPECT);
                else reject(req.status);
            };
            req.open("GET", url, true);
            let token = localStorage.getItem("token");
            if (token) req.setRequestHeader("x-access-token", token);
            req.send();
        });
    }

    static post<TSEND, TEXPECT>(url: string, data: TSEND): Promise<TEXPECT> {
        return new Promise<TEXPECT>((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = (evt) => {
                if (req.readyState !== 4) return;
                if (req.status === 200) resolve(JSON.parse(req.responseText) as TEXPECT);
                else reject(req.status);
            };
            req.open("POST", url, true);
            req.setRequestHeader("Content-Type", "application/json");
            let token = localStorage.getItem("token");
            if (token) req.setRequestHeader("x-access-token", token);
            req.send(JSON.stringify(data));
        });
    }
    
}