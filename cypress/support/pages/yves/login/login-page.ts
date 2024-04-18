import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { LoginRepository } from './login-repository';

@injectable()
@autoWired
export class LoginPage extends YvesPage {
  @inject(REPOSITORIES.LoginRepository) private repository: LoginRepository;

  protected PAGE_URL = '/login';
  protected DEFAULT_SALUTATION = 'Mr';
  protected DEFAULT_PASSWORD_PREFIX = 'Change123@_';

  login = (params: LoginParams): void => {
    this.repository.getLoginEmailInput().clear().type(params.email);
    this.repository.getLoginPasswordInput().clear().type(params.password);

    this.repository.getLoginForm().submit();
  };

  getFailedAuthenticationText = (): string => {
    return this.repository.getFailedAuthenticationText();
  };

  register = (params?: RegisterParams): RegisteredCustomer => {
    this.repository.getRegisterSalutationSelect().select(params?.salutation ?? this.DEFAULT_SALUTATION);
    this.repository
      .getRegisterFirstNameInput()
      .clear()
      .type(params?.firstName ?? this.faker.person.firstName());
    this.repository
      .getRegisterLastNameInput()
      .clear()
      .type(params?.lastName ?? this.faker.person.lastName());

    const registeredCustomer = {
      email: params?.email ?? this.faker.internet.email(),
      password: params?.password ?? this.faker.internet.password({ length: 20, prefix: this.DEFAULT_PASSWORD_PREFIX }),
    };

    this.repository.getRegisterEmailInput().clear().type(registeredCustomer.email);
    this.repository.getRegisterPasswordInput().clear().type(registeredCustomer.password);
    this.repository.getRegisterConfirmPasswordInput().clear().type(registeredCustomer.password);
    this.repository.getRegisterAcceptTermsCheckbox().check({ force: true });

    this.repository.getRegisterForm().submit();
    cy.confirmCustomerByEmail(registeredCustomer.email);

    return registeredCustomer;
  };

  getRegistrationCompletedMessage = (): string => {
    return this.repository.getRegistrationCompletedMessage();
  };
}

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email?: string;
  password?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
}

interface RegisteredCustomer {
  email: string;
  password: string;
}
