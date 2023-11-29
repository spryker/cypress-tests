import { LoginRepository } from "./login.repository";
import { Page } from "../../page";

export class LoginPage extends Page {
    PAGE_URL = '/login';
    DEFAULT_SALUTATION = 'Mr';
    DEFAULT_PASSWORD_PREFIX = 'Change123@_';

    repository: LoginRepository;

    constructor() {
        super();
        this.repository = new LoginRepository();
    }

    login = (email: string, password: string) => {
        cy.visit(this.PAGE_URL);
        this.repository.getLoginEmailInput().clear().type(email);
        this.repository.getLoginPasswordInput().clear().type(password)

        this.repository.getLoginForm().submit();
    }

    register = (
        email?: string, password?: string,
        salutation?: string, firstName?: string, lastName?: string,
    ) => {
        cy.visit(this.PAGE_URL);
        this.repository.getRegisterSalutationSelect().select(salutation ?? this.DEFAULT_SALUTATION);
        this.repository.getRegisterFirstNameInput().clear().type(firstName ?? this.faker.person.firstName());
        this.repository.getRegisterLastNameInput().clear().type(lastName ?? this.faker.person.lastName());

        const customerEmail = email ?? this.faker.internet.email();
        const customerPassword = password ?? this.faker.internet.password({
            length: 20,
            prefix: this.DEFAULT_PASSWORD_PREFIX
        });

        this.repository.getRegisterEmailInput().clear().type(customerEmail);
        this.repository.getRegisterPasswordInput().clear().type(customerPassword);
        this.repository.getRegisterConfirmPasswordInput().clear().type(customerPassword);
        this.repository.getRegisterAcceptTermsCheckbox().check({force: true});

        this.repository.getRegisterForm().submit();

        return {
            email: customerEmail,
            password: customerPassword,
        }
    }
}
