import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ProductMeasurementUnitManagementStaticFixtures } from '../../../support/types/backoffice/product-measurement-unit-management';
import { ProductMeasurementUnitListPage } from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-list-page';
import { ProductMeasurementUnitCreatePage } from '../../../support/pages/backoffice/product-measurement-unit/create/product-measurement-unit-create-page';
import { Interception } from 'cypress/types/net-stubbing';

describe('Measurement Units - List Page', { tags: ['@backoffice', '@product-measurement-unit'] }, () => {
  const productMeasurementUnitListPage = container.get(ProductMeasurementUnitListPage);
  const productMeasurementUnitCreatePage = container.get(ProductMeasurementUnitCreatePage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: ProductMeasurementUnitManagementStaticFixtures;

  beforeEach(() => {
    ({ staticFixtures } = Cypress.env());

    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('renders the Measurement Unit list page (Index Action)', () => {
    // Navigate
    productMeasurementUnitListPage.visit();
    productMeasurementUnitListPage.interceptFetchTable('fetchTable');

    // Assert
    productMeasurementUnitListPage.getPageTitle().should('exist');
    productMeasurementUnitListPage.getCreateButton().should('exist');
    productMeasurementUnitListPage.assertTableContainsColumns();

    // Navigate
    cy.wait('@fetchTable');

    // Assert
    productMeasurementUnitListPage.getTableRows().should('have.length.gte', 1);
  });


  it('fetches and displays measurement unit data (Table Action)', () => {
    // Navigate
    productMeasurementUnitListPage.visit();
    productMeasurementUnitListPage.interceptFetchTable('fetchTable');

    cy.wait('@fetchTable').then((interception: Interception) => {
      // Assign
      const responseStatusCode = interception.response?.statusCode;
      const responseBody = interception.response?.body;
      const firstRow = responseBody.data[0];

      // Assert
      expect(responseStatusCode).to.eq(200);
      expect(responseBody).to.have.property('data');
      expect(responseBody.data).to.be.an('array').with.length.gte(1);

      expect(firstRow[0]).to.not.be.empty; // ID
      expect(firstRow[1]).to.not.be.empty; // code
      expect(firstRow[2]).to.not.be.empty; // name
      expect(firstRow[3]).to.not.be.empty; // default precision
      expect(firstRow[4]).to.not.be.empty; // Actions
    });

    // Assign
    const firstRow = 0;

    // Assert
    productMeasurementUnitListPage.getTableCell(firstRow, 0).should('not.be.empty'); // ID
    productMeasurementUnitListPage.getTableCell(firstRow, 1).should('not.be.empty'); // code
    productMeasurementUnitListPage.getTableCell(firstRow, 2).should('not.be.empty'); // name
    productMeasurementUnitListPage.getTableCell(firstRow, 3).should('not.be.empty'); // default precision
    productMeasurementUnitListPage.getTableEditButton(firstRow).should('exist'); // Edit button
    productMeasurementUnitListPage.getTableDeleteButton(firstRow).should('exist'); // Delete button
  });

  it('shows Create button and allow navigation to Measurement Unit creation form', () => {
    // Navigate
    productMeasurementUnitListPage.visit();
    productMeasurementUnitListPage.getCreateButton().click();

    // Assert
    productMeasurementUnitCreatePage.assertCreateUrl();
    productMeasurementUnitCreatePage.getCodeInputField().should('exist');
    productMeasurementUnitCreatePage.getNameInputField().should('exist');
    productMeasurementUnitCreatePage.getDefaultPrecisionInputField().should('exist');
  });

  it('allows search by code or glossary key (if supported in table)', () => {
    // Navigate
    productMeasurementUnitListPage.visit();

    // Assign
    productMeasurementUnitListPage.clearSearchField();
    productMeasurementUnitListPage.typeSearchField('ITEM');

    // Assert
    productMeasurementUnitListPage.getTableRows().should('exist').and('contain', 'ITEM');
  });

  it('shows paginated results and user can go to next/previous page', () => {
    // Navigate
    productMeasurementUnitListPage.visit();
    productMeasurementUnitListPage.interceptFetchTable('fetchTable');

    // Assign
    productMeasurementUnitListPage.clearSearchField();

    // Assert
    productMeasurementUnitListPage.getPaginationBar().should('be.visible');
    productMeasurementUnitListPage.assertPaginationPageExists(2);
    productMeasurementUnitListPage.assertPaginationActivePage(1);

    // Navigation
    productMeasurementUnitListPage.getPaginationBarPage(2).click();
    cy.wait('@fetchTable');

    // Assert
    productMeasurementUnitListPage.assertPaginationActivePage(2);
    productMeasurementUnitListPage.getTableRows().should('exist');

    // Navigation
    productMeasurementUnitListPage.getPaginationBarPage(1).click();
    cy.wait('@fetchTable');

    productMeasurementUnitListPage.assertPaginationActivePage(1);
    productMeasurementUnitListPage.getTableRows().should('exist');
  });

  it('allows sorting by Code, Name, and Default Precision', () => {
    // Navigate
    productMeasurementUnitListPage.visit();
    productMeasurementUnitListPage.interceptFetchTable('fetchTable');

    // Assign
    const sortableColumns = [
      { name: 'Code', colIndex: 1 },
      { name: 'Name', colIndex: 2 },
      { name: 'Default Precision', colIndex: 3 },
      { name: 'ID', colIndex: 0 },
    ];

    sortableColumns.forEach(({ colIndex }) => {
      // Assign
      productMeasurementUnitListPage.getTableHeader(colIndex).as('header');
      productMeasurementUnitListPage.getTableColumnValues(colIndex).then(
        beforeValues => {
          // Navigate
          cy.get('@header').click();
          cy.wait('@fetchTable');

          // Assign
          productMeasurementUnitListPage.getTableColumnValues(colIndex).then(
            afterValues => {
              // Assert
              expect(beforeValues.join()).to.not.equal(afterValues.join());
            }
          );
      });
    });
  });

});
