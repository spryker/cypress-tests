import {LoginRepository} from "./login.repository";
import {Page} from "../shared/page";
import {faker} from "@faker-js/faker";
import {MailCatcherService} from "../../services/mail.catcher.service";

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
        cy.visit(this.getPageLocation());
        this.repository.getLoginEmailInput().clear().type(email);
        this.repository.getLoginPasswordInput().clear().type(password)

        this.repository.getLoginForm().submit();
    }

    register = (
        email?: string, password?: string,
        salutation?: string, firstName?: string, lastName?: string,
    ) => {
        cy.visit(this.getPageLocation());
        this.repository.getRegisterSalutationSelect().select(salutation ?? this.DEFAULT_SALUTATION);
        this.repository.getRegisterFirstNameInput().clear().type(firstName ?? faker.person.firstName());
        this.repository.getRegisterLastNameInput().clear().type(lastName ?? faker.person.lastName());

        const customerEmail = email ?? faker.internet.email();
        const customerPassword = password ?? faker.internet.password({ length: 20, prefix: this.DEFAULT_PASSWORD_PREFIX });

        this.repository.getRegisterEmailInput().clear().type(customerEmail);
        this.repository.getRegisterPasswordInput().clear().type(customerPassword);
        this.repository.getRegisterConfirmPasswordInput().clear().type(customerPassword);
        this.repository.getRegisterAcceptTermsCheckbox().check({force: true});

        this.repository.getRegisterForm().submit();

        (new MailCatcherService()).verifyCustomerRegistration(customerEmail);

        return {
            email: customerEmail,
            password: customerPassword,
        }
    }
}
