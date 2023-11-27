export class AddressRepository {
    getSelectShippingAddressField = () => {
        return cy.get('.select__select.js-address__form-select-shippingAddress');
    }

    getShippingAddressFirstNameField = () => {
        return cy.get('#addressesForm_shippingAddress_first_name');
    }

    getShippingAddressLastNameField = () => {
        return cy.get('#addressesForm_shippingAddress_last_name');
    }

    getShippingAddressAddress1Field = () => {
        return cy.get('#addressesForm_shippingAddress_address1');
    }

    getShippingAddressAddress2Field = () => {
        return cy.get('#addressesForm_shippingAddress_address2');
    }

    getShippingAddressZipCodeField = () => {
        return cy.get('#addressesForm_shippingAddress_zip_code');
    }

    getShippingAddressCityField = () => {
        return cy.get('#addressesForm_shippingAddress_city');
    }

    getShippingAddressCompanyField = () => {
        return cy.get('#addressesForm_shippingAddress_company');
    }

    getShippingAddressPhoneField = () => {
        return cy.get('#addressesForm_shippingAddress_phone');
    }

    getShippingAddressBillingSameAsShippingCheckbox = () => {
        return cy.get('#addressesForm_billingSameAsShipping');
    }

    getNextButton = () => {
        return cy.contains('button', 'Next');
    }
}
