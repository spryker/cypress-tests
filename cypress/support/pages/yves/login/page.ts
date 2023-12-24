import { AbstractPage } from '../../abstract-page';
import { Repository } from './repository';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';

@injectable()
@autoProvide
export class Page extends AbstractPage {
  PAGE_URL: string = '/login';

  DEFAULT_SALUTATION: string = 'Mr';
  DEFAULT_PASSWORD_PREFIX: string = 'Change123@_';

  repository: Repository;

  constructor(@inject(TYPES.LoginRepository) repository: Repository) {
    super();
    this.repository = repository;
  }

  login = (customer: Customer): void => {
    cy.visit(this.PAGE_URL);
    this.repository.getLoginEmailInput().clear().type(customer.email);
    this.repository.getLoginPasswordInput().clear().type(customer.password);

    this.repository.getLoginForm().submit();
  };

  register = (
    email?: string,
    password?: string,
    salutation?: string,
    firstName?: string,
    lastName?: string
  ): Customer => {
    cy.visit(this.PAGE_URL);
    this.repository
      .getRegisterSalutationSelect()
      .select(salutation ?? this.DEFAULT_SALUTATION);
    this.repository
      .getRegisterFirstNameInput()
      .clear()
      .type(firstName ?? this.faker.person.firstName());
    this.repository
      .getRegisterLastNameInput()
      .clear()
      .type(lastName ?? this.faker.person.lastName());

    const customerEmail = email ?? this.faker.internet.email();
    const customerPassword =
      password ??
      this.faker.internet.password({
        length: 20,
        prefix: this.DEFAULT_PASSWORD_PREFIX,
      });

    this.repository.getRegisterEmailInput().clear().type(customerEmail);
    this.repository.getRegisterPasswordInput().clear().type(customerPassword);
    this.repository
      .getRegisterConfirmPasswordInput()
      .clear()
      .type(customerPassword);
    this.repository.getRegisterAcceptTermsCheckbox().check({ force: true });

    this.repository.getRegisterForm().submit();

    return {
      email: customerEmail,
      password: customerPassword,
    };
  };
}
