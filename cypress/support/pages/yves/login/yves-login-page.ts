import { AbstractPage } from '../../abstract-page';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../utils/inversify/types';
import 'reflect-metadata';
import { autoProvide } from '../../../utils/inversify/auto-provide';
import { YvesLoginRepository } from './yves-login-repository';

@injectable()
@autoProvide
export class YvesLoginPage extends AbstractPage {
  public PAGE_URL: string = '/login';

  private DEFAULT_SALUTATION: string = 'Mr';
  private DEFAULT_PASSWORD_PREFIX: string = 'Change123@_';

  constructor(
    @inject(TYPES.YvesLoginRepository) private repository: YvesLoginRepository
  ) {
    super();
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

  assertFailedAuthentication = (): void => {
    cy.contains(this.repository.getFailedAuthenticationText());
    this.assertPageLocation();
  };
}
