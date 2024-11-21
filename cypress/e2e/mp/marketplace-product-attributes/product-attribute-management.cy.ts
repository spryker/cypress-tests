import { container } from '@utils';
import { ProductManagementDynamicFixtures, ProductManagementStaticFixtures } from '@interfaces/mp';
import { ProductsPage } from '@pages/mp';
import { MerchantUserLoginScenario } from '@scenarios/mp';

(['b2b', 'b2c'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'product attribute management',
  { tags: ['@merchant-product-attributes'] },
  (): void => {
    const productPage = container.get(ProductsPage);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: ProductManagementDynamicFixtures;
    let staticFixtures: ProductManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('Additional requests should not be sent on adding attribute', (): void => {
      merchantUserLoginScenario.execute({
        username: dynamicFixtures.merchantUser.username,
        password: staticFixtures.defaultPassword,
      });

      productPage.visit();
      productPage.getFirstTableRow().click();
      cy.intercept('GET', '/product-merchant-portal-gui/update-product-abstract/table-data**').as('dataTable');
      cy.intercept('GET', '/product-merchant-portal-gui/update-product-abstract').as('createAttribute');

      cy.wait('@dataTable').then(() => {
        cy.get(productPage.getAttributesTableSelector()).scrollIntoView().should('be.visible').then(() => {
          productPage.getAddAttributeButton().click();
          cy.get('@createAttribute.all').should('have.length', 0);
        });
      });
    });
  }
);
