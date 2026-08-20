import { REPOSITORIES, autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import { YvesPage } from '@pages/yves';
import { CompanyRegistrationRepository } from './company-registration-repository';

@injectable()
@autoWired
export class CompanyRegistrationPage extends YvesPage {
  @inject(REPOSITORIES.CompanyRegistrationRepository)
  private repository: CompanyRegistrationRepository;

  protected PAGE_URL = '/company/register';
  protected DEFAULT_SALUTATION = 'Mrs';
  protected DEFAULT_PASSWORD_PREFIX = 'Change!23456';

  register = (params?: CompanyRegistrationParams): RegisteredCompany => {
    const registeredCompany = {
      companyName: params?.companyName ?? this.faker.company.name(),
      email: params?.email ?? this.faker.internet.email(),
      password: params?.password ?? this.faker.internet.password({ length: 20, prefix: this.DEFAULT_PASSWORD_PREFIX }),
    };

    this.repository.getSalutationSelect().select(params?.salutation ?? this.DEFAULT_SALUTATION, { force: true });
    this.repository
      .getFirstNameInput()
      .clear()
      .type(params?.firstName ?? this.faker.person.firstName());
    this.repository
      .getLastNameInput()
      .clear()
      .type(params?.lastName ?? this.faker.person.lastName());
    this.repository.getCompanyNameInput().clear().type(registeredCompany.companyName);
    this.repository.getEmailInput().clear().type(registeredCompany.email);
    this.repository.getPasswordInput().clear().type(registeredCompany.password);
    this.repository.getConfirmPasswordInput().clear().type(registeredCompany.password);
    // The terms checkbox sits behind a styled label, so it is never the visible click target.
    this.repository.getAcceptTermsCheckbox().check({ force: true });

    this.repository.getRegistrationForm().submit();

    return registeredCompany;
  };

  getRegistrationForm = (): Cypress.Chainable => this.repository.getRegistrationForm();

  getPageTitleText = (): string => this.repository.getPageTitleText();

  getRegistrationCompletedMessage = (): string => this.repository.getRegistrationCompletedMessage();
}

interface CompanyRegistrationParams {
  companyName?: string;
  email?: string;
  password?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
}

interface RegisteredCompany {
  companyName: string;
  email: string;
  password: string;
}
