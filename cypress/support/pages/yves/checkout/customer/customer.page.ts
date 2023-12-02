import { CustomerRepository } from './customer.repository';
import { Page } from '../../../page';

export class CustomerPage extends Page {
  PAGE_URL = '/checkout/customer';
  repository: CustomerRepository;

  constructor() {
    super();
    this.repository = new CustomerRepository();
  }

  checkoutAsGuest = (
    firstName?: string,
    lastName?: string,
    email?: string
  ): void => {
    this.repository.getGuestRadioButton().click();

    this.repository
      .getGuestFirstNameField()
      .clear()
      .type(firstName ?? this.faker.person.firstName());
    this.repository
      .getGuestLastNameField()
      .clear()
      .type(lastName ?? this.faker.person.lastName());
    this.repository
      .getGuestEmailField()
      .clear()
      .type(email ?? this.faker.internet.email());
    this.repository.getGuestTermsCheckbox().click();

    this.repository.getGuestSubmitButton().click();
  };
}
