import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  ProductMeasurementUnitManagementDynamicFixtures,
  ProductMeasurementUnitManagementStaticFixtures,
} from '../../../support/types/backoffice/product-measurement-unit-management';
import { ProductMeasurementUnitListPage } from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-list-page';

describe('Measurement Units - List Page', { tags: ['@backoffice', '@product-measurement-unit'] }, () => {
  const productMeasurementUnitListPage = container.get(ProductMeasurementUnitListPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: ProductMeasurementUnitManagementStaticFixtures;
  let dynamicFixtures: ProductMeasurementUnitManagementDynamicFixtures;

  beforeEach(() => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());

    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('renders the Measurement unit list page with measurement units', () => {
    // Assign
    const firstRow = 0;

    // Navigate
    productMeasurementUnitListPage.interceptFetchTable('fetchTable');
    productMeasurementUnitListPage.visit();

    // Assert
    productMeasurementUnitListPage.getPageTitle().should('exist');
    productMeasurementUnitListPage.getCreateButton().should('exist');
    productMeasurementUnitListPage.getTableCodeColumn().should('exist');
    productMeasurementUnitListPage.getPaginationBar().should('exist');

    // Navigate
    cy.wait('@fetchTable');

    productMeasurementUnitListPage.clearSearchField();
    productMeasurementUnitListPage.typeSearchField(dynamicFixtures.productMeasurementUnit.code);

    // Assert
    productMeasurementUnitListPage.getTableRows().should('exist').and('contain', 'ITEM');
    productMeasurementUnitListPage.getTableRows().should('have.length.gte', 1);
    productMeasurementUnitListPage.getTableEditButton(firstRow).should('exist'); // Edit button
    productMeasurementUnitListPage.getTableDeleteButton(firstRow).should('exist'); // Delete button
  });

});
