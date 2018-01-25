import { Rest } from "./rest";
import { LoginForm } from "./login";
import { MenuItem } from "../../common/types/menuitem";

export class Menu {

    static handleError(error: any) {
        if (error === 401) LoginForm.show();
    }

    static onclick(menuItem: MenuItem) {
        Rest.get<any[]>(menuItem.listapi).then((list) => {
            console.log(list);
        }, Menu.handleError);
    }

    static load() {
        let mainMenuOl = document.querySelector<HTMLOListElement>("#mainMenuOl")!;
        mainMenuOl.innerHTML = "";
        Rest.get<MenuItem[]>('/api/menu').then((menuItems) => {
            menuItems.forEach((mi) => {
                console.log(mi);
                let li = document.createElement("li");
                li.innerHTML = mi.label;
                li.addEventListener("click", () => {
                    Menu.onclick(mi);
                });
                mainMenuOl.appendChild(li);
            });
            let logoutLi = document.createElement("li");
            logoutLi.innerHTML = "Logout";
            logoutLi.addEventListener("click", () => {
                mainMenuOl.innerHTML = "";
                LoginForm.show();
            });
            mainMenuOl.appendChild(logoutLi);
        }, Menu.handleError);
    }

}