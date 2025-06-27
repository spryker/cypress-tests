  import { container } from '@utils';
  import { UserLoginScenario } from '@scenarios/backoffice';
  import {
    ProductMeasurementUnitListStaticFixtures
  } from '../../../support/types/backoffice/product-measurement-unit-list';
  import {
    ProductMeasurementUnitPage
  } from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-page';

  describe('Measurement Units - Create and immediate Delete', { tags: ['@backoffice', '@product-measurement-unit'] }, () => {
    const productMeasurementUnitPage = container.get(ProductMeasurementUnitPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductMeasurementUnitListStaticFixtures;

    beforeEach(() => {
      ({ staticFixtures } = Cypress.env());
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('creates a Measurement Unit and deletes it (no product associations)', () => {
      productMeasurementUnitPage.visit();

      // 1. Go to the create form
      cy.get('a').contains(/create/i).click();

      const uniqueCode = `E2E_MU_DEL_${Date.now()}`;
      const glossaryKey = `e2e.unit.${Math.floor(Math.random() * 100000)}`;
      const defaultPrecision = '2';

      // 2. Fill and submit the form
      cy.intercept('POST', '/product-measurement-unit-gui/index/create').as('createMU');
      cy.get('input[name="product_measurement_unit_form[code]"]').type(uniqueCode);
      cy.get('input[name="product_measurement_unit_form[name]"]').type(glossaryKey);
      cy.get('input[name="product_measurement_unit_form[default_precision]"]').clear()
      cy.get('input[name="product_measurement_unit_form[default_precision]"]').type(defaultPrecision);

      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click();
      });
      cy.wait('@createMU');
      cy.url().should('match', /\/product-measurement-unit-gui$/);

      // 3. Confirm success and filter to the newly created MU
      cy.get('.alert-success').should('contain', 'Measurement unit created successfully.');
      cy.get('input[placeholder*="Search"]').clear();
      cy.get('input[placeholder*="Search"]').type(uniqueCode);

      cy.get('div.dataTables_scrollBody table tbody tr').should('have.length', 1)
        .and('contain', uniqueCode);

      cy.intercept('POST', '/product-measurement-unit-gui/index/delete*').as('deleteMU');

      cy.get('div.dataTables_scrollBody table tbody tr').within(() => {
        cy.get('button[data-qa="delete-button"]').click();
      });

      cy.wait('@deleteMU');

      cy.get('.flash-messages').should('contain.text', 'deleted');

      // 5. Ensure the unit no longer appears
      cy.get('input[placeholder*="Search"]').clear();
      cy.get('input[placeholder*="Search"]').type(uniqueCode);

      cy.get('div.dataTables_scrollBody table tbody tr').should('not.contain', uniqueCode);
    });
  });
