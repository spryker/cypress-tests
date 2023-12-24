import { AbstractPage } from '../../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../../../../utils/inversify/types';
import { autoProvide } from '../../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL: string = '/checkout/customer';
  repository: Repository;

  constructor(
    @inject(TYPES.CheckoutCustomerRepository) repository: Repository
  ) {
    super();
    this.repository = repository;
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
