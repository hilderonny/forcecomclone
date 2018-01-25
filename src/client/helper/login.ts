import { Rest } from "./rest";
import { Token } from "../../common/types/token";
import { Menu } from "./menu";

interface LoginUser {
    username: string;
    password: string;
}

export class LoginForm {

    static init() {
        let loginForm = document.forms.namedItem("loginForm");
        let errorInput = loginForm.elements.namedItem("error") as HTMLInputElement;
        let usernameInput = loginForm.elements.namedItem("username") as HTMLInputElement;
        let passwordInput = loginForm.elements.namedItem("password") as HTMLInputElement;
        loginForm.addEventListener("submit", (evt) => {
            errorInput.classList.remove("visible");
            Rest.post<LoginUser, Token>("/api/login", { username: usernameInput.value, password: passwordInput.value } as LoginUser).then((token) => {
                localStorage.setItem("token", token.token);
                LoginForm.hide();
                Menu.load();
            }, (error) => {
                errorInput.value = "Anmeldung fehlgeschlagen!";
                errorInput.classList.add("visible");
            });
            evt.preventDefault();
        });
    }

    static show() {
        let loginForm = document.forms.namedItem("loginForm");
        let errorInput = loginForm.elements.namedItem("error") as HTMLInputElement;
        errorInput.classList.remove("visible");
        localStorage.removeItem("token");
        loginForm.classList.add("visible");
    }

    static hide() {
        let loginForm = document.forms.namedItem("loginForm");
        loginForm.classList.remove("visible");
    }

}