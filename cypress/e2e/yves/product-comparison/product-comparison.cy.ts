import { container } from '@utils';
import { ProductComparisonDynamicFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage, ProductComparisonPage } from '@pages/yves';

(['b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'product comparison',
  { tags: ['@yves', '@product-comparison'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productComparisonPage = container.get(ProductComparisonPage);

    let dynamicFixtures: ProductComparisonDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      cy.clearLocalStorage();
      catalogPage.visit();
    });

    it('customer should be able to add product to comparison list', (): void => {
      addProductToComparisonList(dynamicFixtures.product1.abstract_sku);
      cy.contains(productPage.getAddToComparisonListSuccessMessage());

      cy.get(productComparisonPage.getComparisonPageNavigationLinkSelector()).click({ force: true });
      cy.get(productComparisonPage.getProductItemsSelector()).should('have.length', 1);
    });

    it('customer should be redirected to comparison page after adding two products', (): void => {
      addProductToComparisonList(dynamicFixtures.product1.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product2.abstract_sku);

      productComparisonPage.assertPageLocation();
      cy.get(productComparisonPage.getProductItemsSelector()).should('have.length', 2);
    });

    it('customer should see product attributes comparison table', (): void => {
      addProductToComparisonList(dynamicFixtures.product1.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product2.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product3.abstract_sku);
      productComparisonPage.assertPageLocation();

      cy.get(productComparisonPage.getComparisonTableRowSelector()).should('have.length', 3);
    });

    it('customer should be able to remove product from comparison list', (): void => {
      addProductToComparisonList(dynamicFixtures.product1.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product2.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product3.abstract_sku);
      productComparisonPage.assertPageLocation();

      productComparisonPage.removeProductFromComparisonList(dynamicFixtures.product2.sku);

      productComparisonPage.assertPageLocation();
      cy.get(productComparisonPage.getProductItemsSelector()).should('have.length', 2);
    });

    it('customer should be able to clear the product comparison list', (): void => {
      addProductToComparisonList(dynamicFixtures.product1.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product2.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product3.abstract_sku);
      productComparisonPage.assertPageLocation();

      productComparisonPage.clearComparisonList();

      productComparisonPage.assertPageLocation();
      cy.contains(productComparisonPage.getProductComparisonListIsEmptyMessage());
    });

    it('customer should be able to remove product from comparison from PDP', (): void => {
      addProductToComparisonList(dynamicFixtures.product1.abstract_sku);
      cy.contains(productPage.getAddToComparisonListSuccessMessage());

      productPage.toggleProductComparisonList();
      cy.contains(productPage.getRemoveFromComparisonListSuccessMessage());

      cy.get(productComparisonPage.getComparisonPageNavigationLinkSelector()).click({ force: true, multiple: true });
      cy.contains(productComparisonPage.getProductComparisonListIsEmptyMessage());
    });

    it('customer should be able to add configured number of items to compare list', (): void => {
      addProductToComparisonList(dynamicFixtures.product1.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product2.abstract_sku);
      addProductToComparisonList(dynamicFixtures.product3.abstract_sku);

      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product4.abstract_sku });
      productPage.toggleProductComparisonList();

      cy.contains(productPage.getAddToComparisonListLimitExceededErrorMessage());

      cy.get(productComparisonPage.getComparisonPageNavigationLinkSelector()).click({ force: true });
      cy.get(productComparisonPage.getProductItemsSelector()).should('have.length', 3);
    });

    function addProductToComparisonList(abstractSku: string): void {
      catalogPage.searchProductFromSuggestions({ query: abstractSku });
      productPage.toggleProductComparisonList();
    }
  }
);
