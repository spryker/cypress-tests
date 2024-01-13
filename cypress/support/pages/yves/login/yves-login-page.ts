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

  constructor(@inject(TYPES.YvesLoginRepository) private repository: YvesLoginRepository) {
    super();
  }

  public login = (customer: Customer): void => {
    cy.visit(this.PAGE_URL);
    this.repository.getLoginEmailInput().clear().type(customer.email);
    this.repository.getLoginPasswordInput().clear().type(customer.password);

    this.repository.getLoginForm().submit();
  };

  public register = (customerRegistration?: CustomerRegistration): Customer => {
    if (!customerRegistration) {
      customerRegistration = {
        email: this.faker.internet.email(),
        password: this.faker.internet.password({ length: 20, prefix: this.DEFAULT_PASSWORD_PREFIX }),
        salutation: this.DEFAULT_SALUTATION,
        firstName: this.faker.person.firstName(),
        lastName: this.faker.person.lastName(),
      };
    }

    cy.visit(this.PAGE_URL);
    this.repository.getRegisterSalutationSelect().select(customerRegistration.salutation);
    this.repository.getRegisterFirstNameInput().clear().type(customerRegistration.firstName);
    this.repository.getRegisterLastNameInput().clear().type(customerRegistration.lastName);

    this.repository.getRegisterEmailInput().clear().type(customerRegistration.email);
    this.repository.getRegisterPasswordInput().clear().type(customerRegistration.password);
    this.repository.getRegisterConfirmPasswordInput().clear().type(customerRegistration.password);
    this.repository.getRegisterAcceptTermsCheckbox().check({ force: true });

    this.repository.getRegisterForm().submit();

    return {
      email: customerRegistration.email,
      password: customerRegistration.password,
    };
  };

  public getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };
}
