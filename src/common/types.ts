
export interface AuthenticatedUser {
    username: string;
    clientname: string;
}

export interface Client {
    name: string;
}

export interface LoginUser {
    username: string;
    password: string;
}

export interface TokenResponse {
    token: string;
}