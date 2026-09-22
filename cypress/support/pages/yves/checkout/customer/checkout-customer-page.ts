import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CheckoutCustomerRepository } from './checkout-customer-repository';

@injectable()
@autoWired
export class CheckoutCustomerPage extends YvesPage {
  @inject(REPOSITORIES.CheckoutCustomerRepository) private repository: CheckoutCustomerRepository;

  protected PAGE_URL = '/checkout/customer';

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

  loginDuringCheckout = (params: LoginDuringCheckoutParams): void => {
    this.repository.getLoginRadioButton().click({ force: true });

    this.repository.getLoginEmailField().clear().type(params.email);
    this.repository.getLoginPasswordField().clear().type(params.password, { log: false });

    this.repository.getLoginSubmitButton().click();
  };

  registerDuringCheckout = (params: RegisterDuringCheckoutParams): void => {
    this.repository.getLoginRadioButton().click({ force: true });

    this.repository.getRegisterSalutationField().select(params.salutation, { force: true });
    this.repository.getRegisterFirstNameField().clear().type(params.firstName);
    this.repository.getRegisterLastNameField().clear().type(params.lastName);
    this.repository.getRegisterEmailField().clear().type(params.email);
    this.repository.getRegisterPasswordField().clear().type(params.password, { log: false });
    this.repository.getRegisterConfirmPasswordField().clear().type(params.password, { log: false });
    this.repository.getRegisterTermsCheckbox().check({ force: true });

    this.repository.getRegisterSubmitButton().click();
  };
}

interface LoginDuringCheckoutParams {
  email: string;
  password: string;
}

interface RegisterDuringCheckoutParams {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
