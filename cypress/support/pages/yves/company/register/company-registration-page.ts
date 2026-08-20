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

  register = (): void => {
    const password = this.faker.internet.password({ length: 20, prefix: this.DEFAULT_PASSWORD_PREFIX });

    this.repository.getSalutationSelect().select(this.DEFAULT_SALUTATION, { force: true });
    this.repository.getFirstNameInput().clear().type(this.faker.person.firstName());
    this.repository.getLastNameInput().clear().type(this.faker.person.lastName());
    this.repository.getCompanyNameInput().clear().type(this.faker.company.name());
    this.repository.getEmailInput().clear().type(this.faker.internet.email());
    this.repository.getPasswordInput().clear().type(password);
    this.repository.getConfirmPasswordInput().clear().type(password);
    // The terms checkbox sits behind a styled label, so it is never the visible click target.
    this.repository.getAcceptTermsCheckbox().check({ force: true });

    this.repository.getRegistrationForm().submit();
  };

  getRegistrationForm = (): Cypress.Chainable => this.repository.getRegistrationForm();

  getPageTitle = (): Cypress.Chainable => this.repository.getPageTitle();

  getPageTitleText = (): string => this.repository.getPageTitleText();

  getRegistrationCompletedMessage = (): string => this.repository.getRegistrationCompletedMessage();
}
