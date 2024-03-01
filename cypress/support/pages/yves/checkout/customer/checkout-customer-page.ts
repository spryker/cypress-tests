import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../../utils/inversify/types';
import { CheckoutCustomerRepository } from './checkout-customer-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import { YvesPage } from '../../yves-page';

@injectable()
@autoWired
export class CheckoutCustomerPage extends YvesPage {
  protected PAGE_URL: string = '/checkout/customer';

  constructor(@inject(TYPES.CheckoutCustomerRepository) private repository: CheckoutCustomerRepository) {
    super();
  }

  public checkoutAsGuest = (): string => {
    const guest = {
      firstName: this.faker.person.firstName(),
      lastName: this.faker.person.lastName(),
      email: this.faker.internet.email(),
    };

    this.repository.getGuestRadioButton().click();

    this.repository.getGuestFirstNameField().clear().type(guest.firstName);
    this.repository.getGuestLastNameField().clear().type(guest.lastName);
    this.repository.getGuestEmailField().clear().type(guest.email);
    this.repository.getGuestTermsCheckbox().click();

    this.repository.getGuestSubmitButton().click();

    return guest.email;
  };
}
