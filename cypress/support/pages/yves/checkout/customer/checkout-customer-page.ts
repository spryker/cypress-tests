import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../../utils/inversify/types';
import { CheckoutCustomerRepository } from './checkout-customer-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';
import {Guest} from "../../../../types/refactor_this_file_and_drop_it";



@injectable()
@autoWired
export class CheckoutCustomerPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/customer';

  constructor(@inject(TYPES.YvesCheckoutCustomerRepository) private repository: CheckoutCustomerRepository) {
    super();
  }

  public checkoutAsGuest = (): Guest => {
    const guest: Guest = {
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

    return guest;
  };
}
