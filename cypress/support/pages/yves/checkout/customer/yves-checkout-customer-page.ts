import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../../utils/inversify/types';
import { YvesCheckoutCustomerRepository } from './yves-checkout-customer-repository';
import { autoWired } from '../../../../utils/inversify/auto-wired';

@injectable()
@autoWired
export class YvesCheckoutCustomerPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/customer';

  constructor(@inject(TYPES.YvesCheckoutCustomerRepository) private repository: YvesCheckoutCustomerRepository) {
    super();
  }

  public checkoutAsGuest = (customerGuestForm?: CustomerGuestForm): CustomerGuest => {
    const customerGuest: CustomerGuest = {
      firstName: customerGuestForm?.firstName ?? this.faker.person.firstName(),
      lastName: customerGuestForm?.lastName ?? this.faker.person.lastName(),
      email: customerGuestForm?.email ?? this.faker.internet.email(),
    };

    this.repository.getGuestRadioButton().click();

    this.repository.getGuestFirstNameField().clear().type(customerGuest.firstName);
    this.repository.getGuestLastNameField().clear().type(customerGuest.lastName);
    this.repository.getGuestEmailField().clear().type(customerGuest.email);
    this.repository.getGuestTermsCheckbox().click();

    this.repository.getGuestSubmitButton().click();

    return customerGuest;
  };
}
