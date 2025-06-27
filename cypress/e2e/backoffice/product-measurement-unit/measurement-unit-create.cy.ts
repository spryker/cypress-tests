import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  ProductMeasurementUnitListStaticFixtures
} from '../../../support/types/backoffice/product-measurement-unit-list';
import {
  ProductMeasurementUnitPage
} from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-page';

describe('Measurement Units - Create', { tags: ['@backoffice', '@product-measurement-unit'] }, () => {
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

  it('allows Back Office user to create a new Measurement Unit', () => {
    productMeasurementUnitPage.visit();

    cy.get('a').contains(/Create/i).click();

    const uniqueCode = `E2E_MU_${Date.now()}`;
    const glossaryKey = `e2e.unit.${Math.floor(Math.random() * 100000)}`;
    const defaultPrecision = '4';

    // Fill out the form
    cy.get('input[name="product_measurement_unit_form[code]"]').type(uniqueCode);
    cy.get('input[name="product_measurement_unit_form[name]"]').type(glossaryKey);
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').clear();
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').type(defaultPrecision);

    // Submit the form
    cy.intercept('POST', '/product-measurement-unit-gui/index/create').as('createMU');
    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.wait('@createMU');
    // Should redirect to list page
    cy.url().should('match', /\/product-measurement-unit-gui$/);

    cy.get('input[placeholder*="Search"]').clear();

    // Should see a success flash message
    cy.get('.alert-success').should('contain', 'Measurement unit created successfully.');

    cy.get('input[placeholder*="Search"]').clear()
    cy.get('input[placeholder*="Search"]').type(uniqueCode);
    cy.get('div.dataTables_scrollBody table tbody tr').should('have.length', 1);
    cy.get('div.dataTables_scrollBody table tbody tr').within(() => {
      cy.get('td').eq(1).should('contain', uniqueCode);
      cy.get('td').eq(2).should('contain', glossaryKey);
      cy.get('td').eq(3).should('contain', defaultPrecision);
    });
  });

  it('does not allow to create a Measurement Unit with a duplicate code', () => {
    productMeasurementUnitPage.visit();

    cy.get('a').contains(/Create/i).click();

    // Use a code from existing staticFixtures
    const existingCode = 'ITEM';

    cy.get('input[name="product_measurement_unit_form[code]"]').type(existingCode);
    cy.get('input[name="product_measurement_unit_form[name]"]').type('some.unique.key');
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').clear();
    cy.get('input[name="product_measurement_unit_form[default_precision]"]').type('2');

    cy.get('form').within(() => {
      cy.get('button[type="submit"]').click();
    });

    // Should show an error about uniqueness
    cy.get('.flash-messages').should('contain.text', 'already exists.');
  });
});
