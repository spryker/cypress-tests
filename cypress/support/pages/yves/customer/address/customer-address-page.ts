import { autoWired, REPOSITORIES } from '@utils';
import { inject, injectable } from 'inversify';
import { YvesPage } from '@pages/yves';
import { AddressFormData, CustomerAddressRepository } from './customer-address-repository';

@injectable()
@autoWired
export class CustomerAddressPage extends YvesPage {
  @inject(REPOSITORIES.CustomerAddressRepository) private repository: CustomerAddressRepository;

  protected PAGE_URL = '/customer/address';
  protected NEW_ADDRESS_PAGE_URL = '/customer/address/new';

  visitNewAddressPage = (): void => {
    cy.visit(this.NEW_ADDRESS_PAGE_URL);
  };

  clickAddNewAddress = (): void => {
    this.repository.getAddNewAddressLink().click();
  };

  fillAndSubmitNewAddress = (data: AddressFormData): void => {
    this.repository.getSalutationSelect().select(data.salutation, { force: true });
    this.repository.getFirstNameInput().clear().type(data.firstName);
    this.repository.getLastNameInput().clear().type(data.lastName);
    this.repository.getCompanyInput().clear().type(data.company);
    this.repository.getPhoneInput().clear().type(data.phone);
    this.repository.getAddress1Input().clear().type(data.address1);
    this.repository.getAddress2Input().clear().type(data.address2);
    this.repository.getAddress3Input().clear().type(data.address3);
    this.repository.getCityInput().clear().type(data.city);
    this.repository.getZipCodeInput().clear().type(data.zipCode);
    this.repository.getCountrySelect().select(data.iso2Code, { force: true });

    this.repository.getSubmitButton().click();
  };

  waitForAddressAddedMessage = (): void => {
    cy.contains(this.repository.getAddressAddedMessage()).should('be.visible');
  };
}
