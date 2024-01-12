import { AbstractPage } from '../../../abstract-page';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../../utils/inversify/types';
import { autoProvide } from '../../../../utils/inversify/auto-provide';
import { YvesCheckoutCustomerRepository } from './yves-checkout-customer-repository';

@injectable()
@autoProvide
export class YvesCheckoutCustomerPage extends AbstractPage {
  public PAGE_URL: string = '/checkout/customer';

  constructor(
    @inject(TYPES.CheckoutCustomerRepository)
    private repository: YvesCheckoutCustomerRepository
  ) {
    super();
  }

  checkoutAsGuest = (firstName?: string, lastName?: string, email?: string): void => {
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
