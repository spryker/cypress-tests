import { TYPES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { YvesPage } from '../../yves-page';
import { CheckoutCustomerRepository } from './checkout-customer-repository';

@injectable()
@autoWired
export class CheckoutCustomerPage extends YvesPage {
  @inject(TYPES.CheckoutCustomerRepository) private repository: CheckoutCustomerRepository;

  protected PAGE_URL: string = '/checkout/customer';

  checkoutAsGuest = (): string => {
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
