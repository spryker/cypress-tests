import { container } from '@utils';
import { MerchantStoreStatusDynamicFixtures, MerchantStoreStatusStaticFixtures } from '@interfaces/mp';
import { ProfilePage } from '@pages/mp';
import { CatalogPage, MerchantPage, ProductPage } from '@pages/yves';
import { MerchantUserLoginScenario } from '@scenarios/mp';

describe(
  'merchant store status',
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

    const profilePage = container.get(ProfilePage);
    const merchantPage = container.get(MerchantPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    const publishAndSyncCommands = [
      'console publish:trigger-events -r merchant',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: MerchantStoreStatusStaticFixtures;
    let dynamicFixtures: MerchantStoreStatusDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given an online merchant when it sets its store offline then its profile and its products leave the storefront', (): void => {
      // Arrange
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      // The merchant has no online profile until the portal writes one, so putting the store online
      // is what makes the storefront serve it in the first place.
      setStoreStatus({ isOnline: true });

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
      setStoreStatus({ isOnline: false });

      // Assert
      cy.reloadUntilGone(
        dynamicFixtures.merchantUrlEN.url,
        '[data-qa="component merchant-profile"]',
        'body',
        10,
        3000,
        publishAndSyncCommands
      );

      // An offline merchant takes its whole buy-box entry with it, so the merchant name has to be
      // gone from the detail page rather than merely absent from a block that no longer exists.
      openMerchantProductDetailPage();
      cy.get('body').should('not.contain.text', dynamicFixtures.merchant.name);
    });

    function setStoreStatus(params: { isOnline: boolean }): void {
      profilePage.visit();
      profilePage.openOnlineProfileTab();
      profilePage.setStoreStatus(params);
      profilePage.save();

      cy.runQueueWorker();
    }

    function openMerchantProductDetailPage(): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
    }
  }
);
