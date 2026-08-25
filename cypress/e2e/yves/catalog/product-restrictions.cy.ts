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
    const catalogPage = container.get(CatalogPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ProductRestrictionsStaticFixtures;
    let dynamicFixtures: ProductRestrictionsDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a whitelist scoped to a customer merchant relationship when that customer searches then only the whitelisted product is offered', (): void => {
      // Arrange
      loginAs(staticFixtures.restrictedCustomer.email);

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

    it('given a customer outside that merchant relationship when the same products are searched then both are offered', (): void => {
      // Arrange
      loginAs(staticFixtures.unrestrictedCustomer.email);

      // Act
      catalogPage.visit();
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.allowedProduct.sku });

      // Assert
      catalogPage.getSuggestedProducts().should('exist');

      // Act
      catalogPage.searchSuggestionsFor({ query: dynamicFixtures.hiddenProduct.sku });

      // Assert
      // The list belongs to one merchant relationship, so a customer outside it keeps the whole
      // catalog — which is what proves the restriction is scoped rather than global.
      catalogPage.getSuggestedProducts().should('exist');
    });

    function loginAs(email: string): void {
      customerLoginScenario.execute({ email: email, password: staticFixtures.defaultPassword });
    }
  }
);
