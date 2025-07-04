import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  ProductMeasurementUnitCreatePage
} from '../../../support/pages/backoffice/product-measurement-unit/create/product-measurement-unit-create-page';
import {
  ProductMeasurementUnitListPage
} from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-list-page';
import {
  ProductMeasurementUnitManagementStaticFixtures
} from '../../../support/types/backoffice/product-measurement-unit-management';

describe('Measurement Units - Create', { tags: ['@backoffice', '@product-measurement-unit'] }, () => {
  const productMeasurementUnitCreatePage = container.get(ProductMeasurementUnitCreatePage);
  const productMeasurementUnitListPage = container.get(ProductMeasurementUnitListPage);
  const userLoginScenario = container.get(UserLoginScenario);

  let staticFixtures: ProductMeasurementUnitManagementStaticFixtures;

  beforeEach(() => {
    ({ staticFixtures } = Cypress.env());

    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });
  });

  it('allows back office user to create a new Measurement Unit', () => {
    // Navigate
    productMeasurementUnitCreatePage.visit();

    // Assign
    const randomValue = `${Math.floor(Math.random() * 1000000)}`;
    const uniqueCode = `E2E_MU_${Date.now()}_${randomValue}`;
    const glossaryKey = `e2e.unit.${randomValue}`;
    const defaultPrecision = '4';

    productMeasurementUnitCreatePage.fillCreateForm(uniqueCode, glossaryKey, defaultPrecision);
    productMeasurementUnitCreatePage.interceptCreateFormSubmit('createFormSubmit')

    // Act
    productMeasurementUnitCreatePage.submitCreateForm();
    cy.wait('@createFormSubmit');

    // Assign
    productMeasurementUnitListPage.interceptFetchTable('fetchTable');
    productMeasurementUnitListPage.clearSearchField();
    productMeasurementUnitListPage.typeSearchField(uniqueCode);
    cy.wait('@fetchTable');

    // Assert
    productMeasurementUnitListPage.getTableRows().should('exist').and('contain', uniqueCode);
  });

});
