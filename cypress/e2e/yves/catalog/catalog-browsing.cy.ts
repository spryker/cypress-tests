import { container } from '@utils';
import { CatalogBrowsingStaticFixtures } from '@interfaces/yves';
import { CatalogPage } from '@pages/yves';
import { retryableBefore } from '../../../support/e2e';

describe('catalog browsing', { tags: ['@yves', 'catalog', 'search', 'prices', 'spryker-core'] }, (): void => {
  const catalogPage = container.get(CatalogPage);

  let staticFixtures: CatalogBrowsingStaticFixtures;

  retryableBefore((): void => {
    ({ staticFixtures } = Cypress.env());
  });

  // Counts and prices are read back and compared rather than pinned to a number: the catalog is
  // shared demo data, so any product added anywhere in the suite would invalidate a fixed total.
  const readFoundItemsCount = (): Cypress.Chainable<number> =>
    catalogPage
      .getFoundItemsCounter()
      .invoke('text')
      .then((text: string) => Number(text.replace(/\D/g, '')));

  const readFirstProductPrice = (): Cypress.Chainable<number> =>
    catalogPage
      .getFirstProductItemDefaultPrice()
      .invoke('text')
      .then((text: string) => Number(text.replace(/[^\d.]/g, '')));

  beforeEach((): void => {
    catalogPage.visit();
    catalogPage.searchForProducts({ query: staticFixtures.searchTerm });
  });

  it('given a search result when a colour facet is applied then the catalog narrows to fewer products without emptying', (): void => {
    // Arrange
    let unfilteredCount = 0;
    readFoundItemsCount().then((count: number) => {
      unfilteredCount = count;
    });

    // Act
    catalogPage.applyFilterValue({
      filterName: staticFixtures.colorFilter.name,
      filterValue: staticFixtures.colorFilter.value,
    });

    // Assert
    readFoundItemsCount().should((filteredCount: number) => {
      expect(filteredCount).to.be.greaterThan(0);
      expect(filteredCount).to.be.lessThan(unfilteredCount);
    });
  });

  it('given a search result when it is sorted by price ascending and then descending then the leading product goes from cheapest to dearest', (): void => {
    // Arrange
    let cheapestPrice = 0;
    catalogPage.sortBy({ sortLabel: staticFixtures.ascendingPriceSortLabel });
    readFirstProductPrice().then((price: number) => {
      cheapestPrice = price;
    });

    // Act
    catalogPage.sortBy({ sortLabel: staticFixtures.descendingPriceSortLabel });

    // Assert
    readFirstProductPrice().should((dearestPrice: number) => {
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
    catalogPage
      .getProductItemBlocks()
      .first()
      .invoke('text')
      .then((text: string) => {
        firstPageLeadingProduct = text;
      });

    // Act
    catalogPage.openCatalogPage({ pageNumber: 2 });

    // Assert
    // The url is asserted first so the leading product is read from the page that was navigated to
    // rather than from the one still on screen.
    cy.url().should('include', 'page=2');
    catalogPage
      .getProductItemBlocks()
      .first()
      .invoke('text')
      .should((text: string) => {
        expect(text).to.not.equal(firstPageLeadingProduct);
      });
  });
});
