import { container } from '@utils';
import { CompanyRegistrationPage } from '@pages/yves';

describe(
  'company registration',
  {
    tags: [
      '@yves',
      '@company',
      '@company-registration',
      'company-account',
      'customer-account-management',
      'spryker-core',
    ],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b and b2b-mp', () => {});
      return;
    }
    const companyRegistrationPage = container.get(CompanyRegistrationPage);

    it('guest opens the company registration page → the create-account form is shown', (): void => {
      companyRegistrationPage.visit();

      companyRegistrationPage.assertPageLocation();
      companyRegistrationPage.getPageTitle().should('contain.text', companyRegistrationPage.getPageTitleText());
      companyRegistrationPage.getRegistrationForm().should('be.visible');
    });

    it('guest submits valid company data → the company is registered', (): void => {
      companyRegistrationPage.visit();

      companyRegistrationPage.register();

      // A successful registration redirects to the company overview, which is behind
      // authentication, so a registrant who is not logged in bounces on to the login page.
      cy.url().should('include', '/login');
      companyRegistrationPage.assertBodyContainsText(companyRegistrationPage.getRegistrationCompletedMessage());
    });
  }
);
