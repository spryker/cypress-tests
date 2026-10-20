import { container } from '@utils';
import { OfferApprovalDynamicFixtures, OfferApprovalStaticFixtures } from '@interfaces/backoffice';
import { ProductOfferListPage } from '@pages/backoffice';
import { CatalogPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'offer approval',
  {
    tags: [
      '@backoffice',
      '@marketplace-product-offer',
      'marketplace-product-offer',
      'product-offer',
      'marketplace-product-approval-process',
      'product-approval-process',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because product offers exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    const productOfferListPage = container.get(ProductOfferListPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const userLoginScenario = container.get(UserLoginScenario);

    // A tree-wide publish times the gateway out, so this stays narrowed to what the journey reads.
    const publishAndSyncCommands = [
      'console publish:trigger-events -r product_abstract',
      'console queue:worker:start --stop-when-empty',
    ];

    let staticFixtures: OfferApprovalStaticFixtures;
    let dynamicFixtures: OfferApprovalDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());

      cy.runCliCommands(publishAndSyncCommands);
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given an approved offer on the storefront when the back office denies it then it leaves the detail page, and approving it again brings it back', (): void => {
      // Arrange
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant.name);

      // Act
      productOfferListPage.visit();
      productOfferListPage.findOffer({ query: dynamicFixtures.productOffer.product_offer_reference });
      productOfferListPage.clickDenyButton();
      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      // A denied offer takes its whole buy-box entry with it, so the merchant name has to be gone
      // from the detail page rather than merely absent from a block that no longer exists.
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
      productPage.getBody().should('not.contain.text', dynamicFixtures.merchant.name);

      // Act
      productOfferListPage.visit();
      productOfferListPage.findOffer({ query: dynamicFixtures.productOffer.product_offer_reference });
      productOfferListPage.clickApproveButton();
      cy.runCliCommands(publishAndSyncCommands);

      // Assert
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.merchantProduct.abstract_sku });
      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant.name);
    });
  }
);
