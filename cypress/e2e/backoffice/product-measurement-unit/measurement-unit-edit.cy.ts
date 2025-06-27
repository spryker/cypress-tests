import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  ProductMeasurementUnitListStaticFixtures,
} from '../../../support/types/backoffice/product-measurement-unit-list';
import {
  ProductMeasurementUnitPage,
} from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-page';

describe('Measurement Units - Edit', { tags: ['@backoffice', '@product-measurement-unit'] }, () => {
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

  it('creates a Measurement Unit and successfully edits its glossary key and precision', () => {
    productMeasurementUnitPage.visit();

    // Step 1: Create a unique Measurement Unit
    cy.get('a').contains(/create/i).click();

    const uniqueCode = `E2E_MU_EDIT_${Date.now()}`;
    const glossaryKey = `e2e.edit.key.${Math.floor(Math.random() * 100000)}`;
    const defaultPrecision = '7';

    cy.intercept('POST', '/product-measurement-unit-gui/index/create').as('createMU');
    cy.get('input[name="product_measurement_unit_form[code]"]').type(uniqueCode);
    cy.get('input[name="product_measurement_unit_form[name]"]').type(glossaryKey);
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').clear();
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').type(defaultPrecision);

    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });
    cy.wait('@createMU');
    cy.url().should('match', /product-measurement-unit-gui$/);

    // Confirm creation
    cy.get('.flash-messages').should('contain', 'created');

    // Step 2: Locate and Edit the just-created MU
    cy.get('input[placeholder*="Search"]').clear();
    cy.get('input[placeholder*="Search"]').type(uniqueCode);
    cy.get('div.dataTables_scrollBody table tbody tr').should('contain', uniqueCode);
    cy.get('div.dataTables_scrollBody table tbody tr').within(() => {
      cy.get('a').contains(/edit/i).click();
    });

    // Step 3: Adjust glossary key and precision
    const newGlossaryKey = glossaryKey + '.changed';
    const newPrecision = '12';

    cy.url().should('match', /\/edit/);
    cy.get('form').within(() => {
      cy.get('input[name="product_measurement_unit_form[code]"]').should('have.value', uniqueCode).should('be.disabled');
      cy.get('input[name="product_measurement_unit_form[name]"]').clear();
      cy.get('input[name="product_measurement_unit_form[name]"]').type(newGlossaryKey);
      cy.get('input[name="product_measurement_unit_form[default_precision]"]').clear();
      cy.get('input[name="product_measurement_unit_form[default_precision]"]').type(newPrecision);
      cy.get('button[type="submit"]').click();
    });

    // Step 4: Confirm success and verify changed values in the list
    cy.get('.flash-messages').should('contain', 'success');

    cy.url().should('match', /product-measurement-unit-gui$/);

    cy.get('input[placeholder*="Search"]').clear();
    cy.get('input[placeholder*="Search"]').type(uniqueCode);
    cy.get('div.dataTables_scrollBody table tbody tr').should('have.length', 1).and('contain', uniqueCode);
    cy.get('div.dataTables_scrollBody table tbody tr').within(() => {
      cy.get('td').eq(1).should('contain', uniqueCode);
      cy.get('td').eq(2).should('contain', newGlossaryKey);
      cy.get('td').eq(3).should('contain', newPrecision);
    });
  });
});
