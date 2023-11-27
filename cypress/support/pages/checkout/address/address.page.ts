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

    fillMultiShippingAddress = () => {
        this.repository.getMultiShipmentTriggerButton().click();
        this.repository.getMultiShipmentAddressItemElement().children().each(($addressItem, index) => {
            this.repository.getMultiShipmentAddressItemDeliveryRadio($addressItem, index).click({force: true});
            this.repository.getMultiShipmentAddressItemAddressField($addressItem, index).select('0', {force: true});

            // Setting mandatory fields
            this.repository.getMultiShipmentAddressItemAddressFirstNameField($addressItem, index).clear().type(faker.person.firstName());
            this.repository.getMultiShipmentAddressItemAddressLastNameField($addressItem, index).clear().type(faker.person.lastName());
            this.repository.getMultiShipmentAddressItemAddressAddress1Field($addressItem, index).clear().type(faker.location.secondaryAddress());
            this.repository.getMultiShipmentAddressItemAddressAddress2Field($addressItem, index).clear().type(faker.location.buildingNumber());
            this.repository.getMultiShipmentAddressItemAddressZipCodeField($addressItem, index).clear().type(faker.location.zipCode());
            this.repository.getMultiShipmentAddressItemAddressCityField($addressItem, index).clear().type(faker.location.city());

            // Setting optional fields
            this.repository.getMultiShipmentAddressItemAddressCompanyField($addressItem, index).clear().type(faker.company.name());
            this.repository.getMultiShipmentAddressItemAddressPhoneField($addressItem, index).clear().type(faker.phone.number());
        });

        this.fillBillingAddress();
    }

    fillBillingAddress = (
        firstName?: string, lastName?: string,
        address1?: string, address2?: string, zipCode?: string, city?: string,
        company?: string, phone?: string,
    ) => {
        this.repository.getSelectBillingAddressField().select('0');

        // Setting mandatory fields
        this.repository.getBillingAddressFirstNameField().clear().type(firstName ?? faker.person.firstName());
        this.repository.getBillingAddressLastNameField().clear().type(lastName ?? faker.person.lastName());

        this.repository.getBillingAddressAddress1Field().clear().type(address1 ?? faker.location.secondaryAddress());
        this.repository.getBillingAddressAddress2Field().clear().type(address2 ?? faker.location.buildingNumber());
        this.repository.getBillingAddressZipCodeField().clear().type(zipCode ?? faker.location.zipCode());
        this.repository.getBillingAddressCityField().clear().type(city ?? faker.location.city());

        // Setting optional fields
        this.repository.getBillingAddressCompanyField().clear().type(company ?? faker.company.name());
        this.repository.getBillingAddressPhoneField().clear().type(phone ?? faker.phone.number());

        this.repository.getNextButton().click();
    }
}
