import { container } from '@utils';
import { MerchantUserManagementDynamicFixtures, MerchantUserManagementStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, MerchantUpdatePage, MerchantUserCreatePage } from '@pages/backoffice';
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

    const merchantUpdatePage = container.get(MerchantUpdatePage);
    const merchantUserCreatePage = container.get(MerchantUserCreatePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: MerchantUserManagementStaticFixtures;
    let dynamicFixtures: MerchantUserManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a merchant when the back office adds a user to it then the user can be activated, renamed, deactivated and deleted', (): void => {
      // Arrange
      merchantUpdatePage.visitUsersTab(dynamicFixtures.merchant.id_merchant);
      merchantUpdatePage.create();

      // Act
      const merchantUser = merchantUserCreatePage.create();

      // Assert
      // A merchant user starts deactivated, so activating it is the first thing the back office does.
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', INACTIVE);

      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.activate });
      merchantUpdatePage.visitUsersTab(dynamicFixtures.merchant.id_merchant);
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', ACTIVE);

      // Act
      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.edit });
      const renamedFirstName = `${merchantUser.firstName} renamed`;
      merchantUserCreatePage.rename({ firstName: renamedFirstName });

      // Assert
      merchantUpdatePage.visitUsersTab(dynamicFixtures.merchant.id_merchant);
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', renamedFirstName);

      // Act
      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.deactivate });

      // Assert
      merchantUpdatePage.visitUsersTab(dynamicFixtures.merchant.id_merchant);
      merchantUpdatePage.findMerchantUserRow({ email: merchantUser.username }).should('contain.text', INACTIVE);

      // Act
      merchantUpdatePage.updateMerchantUser({ email: merchantUser.username, action: ActionEnum.delete });

      // Assert
      merchantUpdatePage.getBody().should('contain.text', MERCHANT_USER_DELETED);
      merchantUpdatePage.findDeletableMerchantUserRow({ email: merchantUser.username }).should('not.exist');
    });
  }
);

const INACTIVE = 'Inactive';
const ACTIVE = 'Active';
const MERCHANT_USER_DELETED = 'Merchant user was deleted successfully.';
