import { container } from '@utils';
import { MerchantUserManagementDynamicFixtures, MerchantUserManagementStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, MerchantListPage, MerchantUpdatePage, MerchantUserCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'merchant user management',
  {
    tags: [
      '@backoffice',
      '@marketplace-merchant',
      'marketplace-merchant',
      'merchant',
      'marketplace-merchant-user',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchant users exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const merchantListPage = container.get(MerchantListPage);
    const merchantUpdatePage = container.get(MerchantUpdatePage);
    const merchantUserCreatePage = container.get(MerchantUserCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MerchantUserManagementStaticFixtures;
    let dynamicFixtures: MerchantUserManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant when the back office adds a user to it then the user can be activated, renamed, deactivated and deleted', (): void => {
      // Arrange
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      openMerchantUsers();
      merchantUpdatePage.create();

      // Act
      const merchantUser = merchantUserCreatePage.create();

      // Assert
      // A merchant user starts deactivated, so activating it is the first thing the back office does.
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', DEACTIVATED);

      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.activate });
      openMerchantUsers();
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', ACTIVE);

      // Act
      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.edit });
      const renamedFirstName = `${merchantUser.firstName} renamed`;
      merchantUserCreatePage.rename({ firstName: renamedFirstName });

      // Assert
      openMerchantUsers();
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', renamedFirstName);

      // Act
      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.deactivate });

      // Assert
      openMerchantUsers();
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', DEACTIVATED);

      // Act
      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.delete });

      // Assert
      openMerchantUsers();
      merchantUpdatePage.getBody().should('not.contain.text', merchantUser.username);
    });

    function openMerchantUsers(): void {
      merchantListPage.visit();
      merchantListPage.update({ query: dynamicFixtures.merchant.name, action: ActionEnum.edit });
      merchantUpdatePage.openUsersTab();
    }
  }
);

const DEACTIVATED = 'Deactivated';
const ACTIVE = 'Active';
