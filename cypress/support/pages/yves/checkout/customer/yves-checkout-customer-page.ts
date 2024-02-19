import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../../utils/inversify/types';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { YvesCheckoutCustomerRepository } from './yves-checkout-customer-repository';
import {Customer} from "../../../../types";


@injectable()
@autoProvide
export class YvesCheckoutCustomerPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/customer';

  constructor(@inject(TYPES.YvesCheckoutCustomerRepository) private repository: YvesCheckoutCustomerRepository) {
    super();
  }

  public checkoutAsGuest = (): void => {
    const customerGuest: Customer = {
      firstName: this.faker.person.firstName(),
      lastName: this.faker.person.lastName(),
      email: this.faker.internet.email(),
    };

    this.repository.getGuestRadioButton().click();

    this.repository.getGuestFirstNameField().clear().type(customerGuest.firstName);
    this.repository.getGuestLastNameField().clear().type(customerGuest.lastName);
    this.repository.getGuestEmailField().clear().type(customerGuest.email);
    this.repository.getGuestTermsCheckbox().click();

    this.repository.getGuestSubmitButton().click();
  };
}
