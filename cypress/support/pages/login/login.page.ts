import {LoginRepository} from "./login.repository";
import {Page} from "../shared/page";

export class LoginPage extends Page {
    PAGE_URL = '/login';
    repository: LoginRepository;

    constructor() {
        super();
        this.repository = new LoginRepository();
    }

    login = (email: string, password: string) => {
        cy.visit(this.getPageLocation());
        this.repository.getLoginEmailInput().clear().type(email);
        this.repository.getLoginPasswordInput().clear().type(password)

        this.repository.getLoginForm().submit();
    }
}
