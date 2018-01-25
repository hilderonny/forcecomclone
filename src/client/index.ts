import { LoginForm } from "./helper/login";
import { Menu } from "./helper/menu";


window.addEventListener("load", () => {
    
    LoginForm.init();

    Menu.load();
   
});