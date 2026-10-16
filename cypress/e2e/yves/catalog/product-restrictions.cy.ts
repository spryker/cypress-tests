import { container } from '@utils';
import { ProductRestrictionsDynamicFixtures, ProductRestrictionsStaticFixtures } from '@interfaces/yves';
import { CatalogPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'product restrictions',
  {
    tags: ['@yves', 'product-lists', 'product-customer-restrictions', 'catalog', 'search', 'spryker-core'],
  },
  (): void => {
    // The product lists are scoped to merchant relationships, which the B2C shops do not have.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b and b2b-mp', () => {});

      return;
    }

    const catalogPage = container.get(CatalogPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductRestrictionsStaticFixtures;
    let dynamicFixtures: ProductRestrictionsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a whitelist scoped to a customer merchant relationship when that customer searches then only the whitelisted product is offered', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.whitelistedCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      catalogPage.visit();
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.allowedProduct.sku });

      // Assert
      catalogPage.getSuggestedProducts().should('exist');

      // Act
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.hiddenProduct.sku });

      // Assert
      // A whitelist narrows the catalog to what it lists, so a product it does not name is not
      // offered to this customer at all.
      catalogPage.getSuggestedProducts().should('not.exist');
    });

    it('given a blacklist scoped to a customer merchant relationship when that customer searches then every product but the blacklisted one is offered', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.blacklistedCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      catalogPage.visit();
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.allowedProduct.sku });

      // Assert
      // A blacklist only takes away what it lists, so a product it does not name stays offered.
      catalogPage.getSuggestedProducts().should('exist');

      // Act
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.hiddenProduct.sku });

      // Assert
      catalogPage.getSuggestedProducts().should('not.exist');
    });

    it('given a customer outside both merchant relationships when the same products are searched then both are offered', (): void => {
      // Arrange
      customerLoginScenario.execute({
        email: dynamicFixtures.unrestrictedCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      // Act
      catalogPage.visit();
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.allowedProduct.sku });

      // Assert
      catalogPage.getSuggestedProducts().should('exist');

      // Act
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.hiddenProduct.sku });

      // Assert
      // The lists belong to merchant relationships, so a customer outside them keeps the whole
      // catalog — which is what proves the restrictions are scoped rather than global.
      catalogPage.getSuggestedProducts().should('exist');
    });
  }
);
