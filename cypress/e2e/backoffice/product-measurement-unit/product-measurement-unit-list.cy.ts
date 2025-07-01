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

  it('renders the Measurement unit list page with searchable measurement units', () => {
    // Navigate
    productMeasurementUnitListPage.interceptFetchTable('fetchTable');
    productMeasurementUnitListPage.visit();

    // Assert
    productMeasurementUnitListPage.getCreateButton().should('exist');
    productMeasurementUnitListPage.getTableCodeColumn().should('exist');
    productMeasurementUnitListPage.getPaginationBar().should('exist');

    // Act
    productMeasurementUnitListPage.clearSearchField();
    productMeasurementUnitListPage.typeSearchField(dynamicFixtures.productMeasurementUnit.code);
    cy.wait('@fetchTable');

    // Assert
    const firstRow = 0;
    productMeasurementUnitListPage.getTableRows().should('exist').and('contain', dynamicFixtures.productMeasurementUnit.code);
    productMeasurementUnitListPage.getTableEditButton(firstRow).should('exist');
    productMeasurementUnitListPage.getTableDeleteButton(firstRow).should('exist');
  });

});
