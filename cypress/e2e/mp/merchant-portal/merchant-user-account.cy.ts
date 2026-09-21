import { container } from '@utils';
import { MerchantUserAccountDynamicFixtures, MerchantUserAccountStaticFixtures } from '@interfaces/mp';
import { AccountPage } from '@pages/mp';
import { UserIndexPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserAccountScenario, MerchantUserLoginScenario } from '@scenarios/mp';

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
    const userIndexPage = container.get(UserIndexPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);
    const merchantUserAccountScenario = container.get(MerchantUserAccountScenario);

    let staticFixtures: MerchantUserAccountStaticFixtures;
    let dynamicFixtures: MerchantUserAccountDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant user when it edits its own name and password in the portal then the new password signs it in and the back office lists the new name', (): void => {
      // Arrange
      const firstName = `First${Date.now()}`;
      const lastName = `Last${Date.now()}`;
      const newPassword = `${staticFixtures.defaultPassword}Updated!1`;

      signInToPortal(staticFixtures.defaultPassword);

      // Act
      accountPage.visitAccount();
      accountPage.updatePersonalDetails({ firstName, lastName });

      // Saving the account form ends the portal session, so the password change needs a fresh sign-in.
      signInToPortal(staticFixtures.defaultPassword);

      merchantUserAccountScenario.executeChangePassword(staticFixtures.defaultPassword, newPassword);

      // Assert
      signInToPortal(newPassword);

      accountPage.visitAccount();
      accountPage.getFirstNameValue().should('have.value', firstName);

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      userIndexPage.visit();
      userIndexPage.findUser({ query: dynamicFixtures.merchantUser.username }).should('contain.text', firstName);
    });

    function signInToPortal(password: string): void {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: password,
        withoutSession: true,
      });
    }
  }
);
