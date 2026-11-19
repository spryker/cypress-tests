import { container } from '@utils';
import { CatalogPage } from '@pages/yves';
import { CustomerItemNumberSearchStaticFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'customer item number search',
  { tags: ['@yves', 'search', 'catalog', 'customer-item-number', 'spryker-core'] },
  (): void => {
    // The item numbers of the Acme company come from the suite demo data (customer_item_number.csv).
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because the customer item number demo data exists only in suite', () => {});
      return;
    }

    const catalogPage = container.get(CatalogPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: CustomerItemNumberSearchStaticFixtures;

    before((): void => {
      ({ staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: staticFixtures.companyUser.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should suggest the item numbers that start with the typed text first, in natural order', (): void => {
      // Act
      catalogPage.visit();
      catalogPage.searchSuggestionsFor({ query: staticFixtures.itemNumberPrefix });

      // Assert
      catalogPage.getFirstSearchSuggestionTerm().should('have.text', staticFixtures.firstSuggestedItemNumber);
    });

    it('should show the item number with the matched part and the SKU on the product of an exact match', (): void => {
      // Act
      catalogPage.visit();
      catalogPage.searchSuggestionsFor({ query: staticFixtures.exactMatch.itemNumber.toLowerCase() });

      // Assert
      catalogPage.getFirstSearchSuggestionTerm().should('have.text', staticFixtures.exactMatch.itemNumber);
      catalogPage
        .getCustomerItemNumberSuggestionHighlight(staticFixtures.exactMatch.itemNumber)
        .should('have.text', staticFixtures.exactMatch.itemNumber);
      catalogPage
        .getCustomerItemNumberSuggestionSku(staticFixtures.exactMatch.itemNumber)
        .should('have.text', staticFixtures.exactMatch.sku);
    });

    it('should show the product of an exact item number match first in the search results', (): void => {
      // Act
      catalogPage.visit({ qs: { q: ` ${staticFixtures.exactMatch.itemNumber.toLowerCase()} ` } });

      // Assert
      catalogPage.getProductItemBlocks().first().should('contain', staticFixtures.exactMatch.productName);
    });
  }
);
