import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';

export class Page extends AbstractPage {
  PAGE_URL = '/checkout/customer';
  repository: Repository;

  constructor() {
    super();
    this.repository = new Repository();
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
