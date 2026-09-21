import { container } from '@utils';
import { MerchantDeactivationDynamicFixtures, MerchantDeactivationStaticFixtures } from '@interfaces/backoffice';
import { ActionEnum, MerchantListPage } from '@pages/backoffice';
import { ProfilePage } from '@pages/mp';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'merchant deactivation',
  {
    tags: [
      '@backoffice',
      '@marketplace-merchant',
      'marketplace-merchant',
      'merchant',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchants exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const merchantListPage = container.get(MerchantListPage);
    const profilePage = container.get(ProfilePage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    const publishAndSyncCommands = [
      'console publish:trigger-events -r merchant',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: MerchantDeactivationStaticFixtures;
    let dynamicFixtures: MerchantDeactivationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a merchant offered on the storefront when the back office deactivates it then its profile and its products leave the storefront', (): void => {
      // Arrange
      // The merchant has no online profile until the portal writes one, which is what puts it on the storefront.
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      profilePage.visit();
      profilePage.openOnlineProfileTab();
      profilePage.setStoreStatus({ isOnline: true });
      profilePage.save();

      cy.reloadUntilFound(
        dynamicFixtures.merchantUrlEN.url,
        '[data-qa="component merchant-profile"]',
        'body',
        10,
        3000,
        publishAndSyncCommands
      );

      openMerchantProductDetailPage();
      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant.name);

      // Act
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      merchantListPage.visit();
      merchantListPage.update({ query: dynamicFixtures.merchant.name, action: ActionEnum.deactivate });

      // Assert
      cy.reloadUntilGone(
        dynamicFixtures.merchantUrlEN.url,
        '[data-qa="component merchant-profile"]',
        'body',
        10,
        3000,
        publishAndSyncCommands
      );

      // A deactivated merchant takes its whole buy-box entry with it, so the merchant name has to be
      // gone from the detail page rather than merely absent from a block that no longer exists.
      openMerchantProductDetailPage();
      productPage.getBody().should('not.contain.text', dynamicFixtures.merchant.name);
    });

    function openMerchantProductDetailPage(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
    }
  }
);
