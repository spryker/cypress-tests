import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ProductMeasurementUnitCreatePage } from '../../../support/pages/backoffice/product-measurement-unit/create/product-measurement-unit-create-page';
import { ProductMeasurementUnitListPage } from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-list-page';
import {
  ProductMeasurementUnitManagementDynamicFixtures,
  ProductMeasurementUnitManagementStaticFixtures,
} from '../../../support/types/backoffice/product-measurement-unit-management';

(['suite', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'Measurement Units - Create Page',
  { tags: ['@backoffice', '@product-measurement-unit', 'measurement-units'] },
  (): void => {
    const productMeasurementUnitCreatePage = container.get(ProductMeasurementUnitCreatePage);
    const productMeasurementUnitListPage = container.get(ProductMeasurementUnitListPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ProductMeasurementUnitManagementStaticFixtures;
    let dynamicFixtures: ProductMeasurementUnitManagementDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('allows back office user to create a new Measurement Unit', () => {
      // Act
      productMeasurementUnitCreatePage.visit();

      // Assign
      const randomValue = `${Math.floor(Math.random() * 1000000)}`;
      const uniqueCode = `E2E_MU_${Date.now()}_${randomValue}`;
      const glossaryKey = `e2e.unit.${randomValue}`;
      const defaultPrecision = '4';
      productMeasurementUnitCreatePage.fillCreateForm(uniqueCode, glossaryKey, defaultPrecision);

      // Act
      productMeasurementUnitCreatePage.submitCreateForm();
      productMeasurementUnitListPage.findByText(uniqueCode);

      // Assert
      productMeasurementUnitListPage.getTableRows().should('exist').and('contain', uniqueCode);
    });
  }
);
