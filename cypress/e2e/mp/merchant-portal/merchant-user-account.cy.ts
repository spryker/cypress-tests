import { container } from '@utils';
import { MerchantUserAccountDynamicFixtures, MerchantUserAccountStaticFixtures } from '@interfaces/mp';
import { AccountPage, LoginPage } from '@pages/mp';
import { UserIndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserAccountScenario } from '@scenarios/mp';

describe(
  'merchant user account',
  {
    tags: [
      '@mp',
      '@marketplace-merchant',
      'marketplace-merchant',
      'merchant',
      'marketplace-merchantportal-core',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the merchant portal exists only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const accountPage = container.get(AccountPage);
    const loginPage = container.get(LoginPage);
    const userIndexPage = container.get(UserIndexPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const merchantUserAccountScenario = container.get(MerchantUserAccountScenario);

    let signInCount = 0;
    let staticFixtures: MerchantUserAccountStaticFixtures;
    let dynamicFixtures: MerchantUserAccountDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant user when it edits its own name and password in the portal then the new password signs it in and the back office lists the new name', (): void => {
      // Arrange
      const firstName = `First${Date.now()}`;
      const lastName = `Last${Date.now()}`;

      signInToPortal(staticFixtures.merchantUserPassword);

      // Act
      accountPage.visitAccount();
      accountPage.updatePersonalDetails({ firstName: firstName, lastName: lastName });

      // Assert
      // Saving the account form ends the portal session, so reading the name back needs a fresh
      // sign-in.
      signInToPortal(staticFixtures.merchantUserPassword);
      accountPage.visitAccount();
      accountPage.getFirstNameValue().should('have.value', firstName);

      // Act
      merchantUserAccountScenario.executeChangePassword(
        staticFixtures.merchantUserPassword,
        staticFixtures.updatedMerchantUserPassword
      );

      // Assert
      signInToPortal(staticFixtures.updatedMerchantUserPassword);
      accountPage.visitAccount();
      accountPage.getFirstNameValue().should('have.value', firstName);

      // The password is put back so that a retry of this test starts from the state it assumes.
      merchantUserAccountScenario.executeChangePassword(
        staticFixtures.updatedMerchantUserPassword,
        staticFixtures.merchantUserPassword
      );

      // Assert
      // The back office is read last: signing in there as another Zed user ends the portal session.
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      userIndexPage.visit();
      userIndexPage.findUser({ query: dynamicFixtures.merchantUser.username }).should('contain.text', firstName);
      userIndexPage.findUser({ query: dynamicFixtures.merchantUser.username }).should('contain.text', lastName);
    });

    // Signed in directly rather than through the shared scenario: this test signs in four times
    // with two different passwords, and the scenario reuses one intercept alias for all of them.
    // The portal also redirects an active session away from its login page, so the session is
    // dropped first.
    function signInToPortal(password: string): void {
      const signInAlias = `merchantUserSignedIn${signInCount++}`;

      loginPage.clearSessionCookie();
      loginPage.visit();

      cy.intercept('POST', '**/login_check').as(signInAlias);
      loginPage.login({ username: dynamicFixtures.merchantUser.username, password: password });
      cy.wait(`@${signInAlias}`);
    }
  }
);
