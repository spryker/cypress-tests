import {AddressRepository} from "./address.repository";
import {Page} from "../../shared/page";
import {faker} from "@faker-js/faker";

export class AddressPage extends Page {
    PAGE_URL = '/checkout/address';
    repository: AddressRepository;

    constructor() {
        super();
        this.repository = new AddressRepository();
    }

    fillShippingAddress = (
        firstName?: string, lastName?: string,
        address1?: string, address2?: string, zipCode?: string, city?: string,
        company?: string, phone?: string,
    ) => {
        this.repository.getSelectShippingAddressField().select('0');

        // Setting mandatory fields
        this.repository.getShippingAddressFirstNameField().clear().type(firstName ?? faker.person.firstName());
        this.repository.getShippingAddressLastNameField().clear().type(lastName ?? faker.person.lastName());

        this.repository.getShippingAddressAddress1Field().clear().type(address1 ?? faker.location.secondaryAddress());
        this.repository.getShippingAddressAddress2Field().clear().type(address2 ?? faker.location.buildingNumber());
        this.repository.getShippingAddressZipCodeField().clear().type(zipCode ?? faker.location.zipCode());
        this.repository.getShippingAddressCityField().clear().type(city ?? faker.location.city());
        this.repository.getShippingAddressBillingSameAsShippingCheckbox().check({force: true});

        // Setting optional fields
        this.repository.getShippingAddressCompanyField().clear().type(company ?? faker.company.name());
        this.repository.getShippingAddressPhoneField().clear().type(phone ?? faker.phone.number());

        this.repository.getNextButton().click();
    }
}
