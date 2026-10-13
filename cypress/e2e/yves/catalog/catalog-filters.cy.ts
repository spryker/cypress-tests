import { container } from '@utils';
import { CatalogFiltersDynamicFixtures, CatalogFiltersStaticFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';
import { retryableBefore } from '../../../support/e2e';

describe('catalog filters', { tags: ['@yves', 'catalog', 'search', 'prices', 'spryker-core'] }, (): void => {
  const catalogPage = container.get(CatalogPage);
  const productPage = container.get(ProductPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: CatalogFiltersStaticFixtures;
  let dynamicFixtures: CatalogFiltersDynamicFixtures;

  retryableBefore((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  // The B2B shops hide the catalog and its prices from guests, so every shop browses as a customer.
  beforeEach((): void => {
    customerLoginScenario.execute({
      email: dynamicFixtures.customer.email,
      password: staticFixtures.defaultPassword,
    });
  });

  // Counts and prices are read back and compared rather than pinned to a number: the catalog is
  // shared demo data, so any product added anywhere in the suite would invalidate a fixed total.
  describe('on a search result', (): void => {
    beforeEach((): void => {
      catalogPage.visit();
      catalogPage.searchForProducts({ query: staticFixtures.searchTerm });
    });

    it('given a search result when a colour facet is applied then the catalog narrows to fewer products without emptying', (): void => {
      // Arrange
      let unfilteredCount = 0;
      catalogPage.getFoundItemsCount().then((count: number) => {
        unfilteredCount = count;
      });

      // Act
      catalogPage.applyFilterValue({
        filterName: staticFixtures.colorFilter.name,
        filterValue: staticFixtures.colorFilter.value,
      });

      // Assert
      catalogPage.getFoundItemsCount().should((filteredCount: number) => {
        expect(filteredCount).to.be.greaterThan(0);
        expect(filteredCount).to.be.lessThan(unfilteredCount);
      });
    });

    it('given a search result when it is sorted by price ascending and then descending then the leading product goes from cheapest to dearest', (): void => {
      // Arrange
      let cheapestPrice = 0;
      catalogPage.sortBy({ sortLabel: staticFixtures.ascendingPriceSortLabel });
      catalogPage.getFirstProductItemDefaultPriceAmount().then((price: number) => {
        cheapestPrice = price;
      });

      // Act
      catalogPage.sortBy({ sortLabel: staticFixtures.descendingPriceSortLabel });

      // Assert
      catalogPage.getFirstProductItemDefaultPriceAmount().should((dearestPrice: number) => {
        expect(dearestPrice).to.be.greaterThan(cheapestPrice);
      });
    });

    it('given a search result when its facets are read then the catalog offers every filter it is configured with', (): void => {
      // Act
      const filterTitles = catalogPage.getFilterTitles();

      // Assert
      filterTitles.invoke('text').should((titles: string) => {
        staticFixtures.filterTitles.forEach((title) => expect(titles).to.contain(title));
      });
    });

    it('given a search result spanning more than one page when the second page is opened then it lists other products than the first', (): void => {
      // Arrange
      let firstPageLeadingProduct = '';
      catalogPage.getFirstProductItemText().then((text: string) => {
        firstPageLeadingProduct = text;
      });

      // Act
      catalogPage.openCatalogPage({ pageNumber: 2 });

      // Assert
      // The url is asserted first so the leading product is read from the page that was navigated to
      // rather than from the one still on screen.
      cy.url().should('include', 'page=2');
      catalogPage.getFirstProductItemText().should((text: string) => {
        expect(text).to.not.equal(firstPageLeadingProduct);
      });
    });
  });

  describe('merchant filter', { tags: ['@marketplace-merchant', 'marketplace-merchant', 'merchant'] }, (): void => {
    if (!['suite', 'b2c-mp', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because merchants exist only in suite, b2b-mp and b2c-mp', () => {});

      return;
    }

    before((): void => {
      // The fixture products reach the catalog only once it has been rebuilt. A tree-wide publish
      // times the gateway out, so this stays narrowed to the catalog.
      cy.runCliCommands([
        'console publish:trigger-events -r product_abstract',
        'console queue:worker:start --stop-when-empty',
      ]);
    });

    it("given two merchants offering a product of the same name when the merchant facet is applied then only that merchant's product is listed", (): void => {
      // Arrange
      // Both fixture products carry the same name, so the query returns both of them alongside the
      // catalog's own matches, and the merchant facet is what narrows the list.
      catalogPage.visit();
      catalogPage.searchForProducts({ query: dynamicFixtures.localizedAttribute.name });
      catalogPage.getProductItemBlocks().should('have.length.at.least', 2);

      // Act
      catalogPage.applyFilterValue({
        filterName: staticFixtures.merchantFilterName,
        filterValue: dynamicFixtures.merchant2.name,
      });

      // Assert
      // Only the second merchant's product carries that merchant, so the facet leaves exactly it.
      catalogPage.getProductItemBlocks().should('have.length', 1);

      catalogPage.openFirstProductDetailPageFromResults();
      productPage.getSoldByProductOffers().should('contain.text', dynamicFixtures.merchant2.name);
    });
  });
});
