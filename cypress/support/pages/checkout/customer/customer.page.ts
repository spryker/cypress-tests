import {CustomerRepository} from "./customer.repository";
import {Page} from "../../shared/page";
import {faker} from "@faker-js/faker";

export class CustomerPage extends Page
{
    PAGE_URL = '/checkout/customer';
    repository: CustomerRepository;

    constructor()
    {
        super();
        this.repository = new CustomerRepository();
    }

    checkoutAsGuest = (firstName?: string, lastName?: string, email?: string) =>
    {
        this.repository.getGuestRadioButton().click();

        this.repository.getGuestFirstNameField().clear().type(firstName ?? faker.person.firstName());
        this.repository.getGuestLastNameField().clear().type(lastName ?? faker.person.lastName());
        this.repository.getGuestEmailField().clear().type(email ?? faker.internet.email());
        this.repository.getGuestTermsCheckbox().click();

        this.repository.getGuestSubmitButton().click();
    }
}
