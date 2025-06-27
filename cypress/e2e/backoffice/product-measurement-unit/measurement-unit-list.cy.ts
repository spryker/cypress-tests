import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  ProductMeasurementUnitListStaticFixtures
} from '../../../support/types/backoffice/product-measurement-unit-list';
import {
  ProductMeasurementUnitPage
} from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-page';

describe('Measurement Units - List Page', { tags: ['@backoffice', '@product-measurement-unit'] }, () => {
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

  it('renders the Measurement Unit list page (Index Action)', () => {
    productMeasurementUnitPage.visit();

    cy.get('h2').contains('Measurement Unit').should('exist');
    cy.get('a').contains(/Create/i).should('exist');
    cy.get('table thead').should('contain', 'Code')
      .and('contain', 'Name')
      .and('contain', 'Default Precision');

    // Table might initially show loading, wait for tableAction xhr
    cy.intercept('GET', '/product-measurement-unit-gui/index/table*').as('fetchTable');
    cy.wait('@fetchTable');

    cy.get('table tbody tr').should('have.length.gte', 1); // as per seed
  });


  it('fetches and displays measurement unit data (Table Action)', () => {
    productMeasurementUnitPage.visit();

    cy.intercept('GET', '/product-measurement-unit-gui/index/table*').as('fetchTable');
    cy.wait('@fetchTable').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);

      const body = interception.response.body;
      // Your backend might return: { data: [ { code: "PCS", glossary_key: "unit.piece", default_precision: 1, ... } ], ... }
      expect(body).to.have.property('data');
      expect(body.data).to.be.an('array').with.length.gte(1);

      // Check the first row for required fields
      const row = body.data[0];
      expect(row[0]).to.not.be.empty; // ID
      expect(row[1]).to.not.be.empty; // code
      expect(row[2]).to.not.be.empty; // name
      expect(row[3]).to.not.be.empty; // default precision
      expect(row[4]).to.not.be.empty; // Actions
    });

    // Confirm table visuals (match backend data with row text)
    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(0).should('not.be.empty'); // code
      cy.get('td').eq(1).should('not.be.empty'); // name
      cy.get('td').eq(2).should('not.be.empty'); // default precision
      cy.get('a').contains(/edit/i).should('exist');
      cy.get('button').contains(/delete/i).should('exist');
      cy.get('button[data-qa="delete-button"]').should('exist');

    });
  });

  it('shows Add button and allow navigation to Measurement Unit creation form', () => {
    productMeasurementUnitPage.visit();

    cy.get('a').contains(/Create/i).click();
    cy.url().should('include', '/create');
    cy.get('form').within(() => {
      cy.get('input[name="product_measurement_unit_form[code]"]').should('exist');
      cy.get('input[name="product_measurement_unit_form[name]"]').should('exist');
      cy.get('input[name="product_measurement_unit_form[default_precision]"]').should('exist');
    });
  });

  it('allows search by code or glossary key (if supported in table)', () => {
    productMeasurementUnitPage.visit();

    cy.get('input[placeholder*="Search"]').clear();
    cy.get('input[placeholder*="Search"]').type('item');
    cy.get('div.dataTables_scrollBody table tbody tr').should('exist').and('contain', 'item');
  });

  it('shows paginated results and user can go to next/previous page', () => {
    productMeasurementUnitPage.visit();

    cy.get('input[placeholder*="Search"]').clear();

    cy.get('.dataTables_paginate').should('be.visible');
    cy.get('.dataTables_paginate').within(() => {
      cy.get('a').contains('2').should('exist'); // At least a second page
      cy.get('.paginate_button.active').should('contain', '1')
    });

    cy.intercept('GET', '/product-measurement-unit-gui/index/table*').as('fetchTable');

    cy.get('.dataTables_paginate').contains('2').click();

    cy.wait('@fetchTable');
    cy.get('.dataTables_paginate .paginate_button.active').should('contain', '2');

    cy.get('div.dataTables_scrollBody table tbody tr').should('exist');

    cy.get('.dataTables_paginate').contains('1').click();
    cy.wait('@fetchTable');
    cy.get('.dataTables_paginate .paginate_button.active').should('contain', '1');
  });

  it('allows sorting by Code, Name, and Default Precision', () => {
    productMeasurementUnitPage.visit();

    const headerSelectors = [
      { col: 0, label: /code/i, prop: 'code' },
      { col: 1, label: /name/i, prop: 'name' },
      { col: 2, label: /default precision/i, prop: 'defaultPrecision' }
    ];

    cy.intercept('GET', '/product-measurement-unit-gui/index/table*').as('fetchTable');

    headerSelectors.forEach(({ col, label, prop }) => {
      // Collect values before sort
      cy.get('div.dataTables_scrollHead thead tr th').eq(col).as('header');
      cy.get('div.dataTables_scrollBody table tbody tr td').then($tdsBefore => {
        const before = [];
        cy.get('div.dataTables_scrollBody table tbody tr').each($tr => {
          before.push($tr.find('td').eq(col).text());
        });

        cy.get('@header').click();

        cy.wait('@fetchTable');
        cy.get('@header').click();
        cy.wait('@fetchTable');
        cy.get('div.dataTables_scrollBody table tbody tr').then($tdsAfter => {
          const after = [];
          cy.get('div.dataTables_scrollBody table tbody tr').each($tr => {
            after.push($tr.find('td').eq(col).text());
          });
          expect(before.join() !== after.join()).to.be.true;
        });
      });
    });
  });
});
