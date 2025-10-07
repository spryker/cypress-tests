import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import {
  ProductMeasurementUnitManagementDynamicFixtures,
  ProductMeasurementUnitManagementStaticFixtures,
} from '../../../support/types/backoffice/product-measurement-unit-management';
import { ProductMeasurementUnitListPage } from '../../../support/pages/backoffice/product-measurement-unit/list/product-measurement-unit-list-page';

(['suite', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
  'Measurement Units - List Page',
  { tags: ['@backoffice', '@product-measurement-unit','measurement-units'] },
  (): void => {
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

    it('renders the Measurement unit list page with searchable measurement units', () => {
      // Act
      productMeasurementUnitListPage.visit();

      // Assert
      productMeasurementUnitListPage.getCreateButton().should('exist');
      productMeasurementUnitListPage.getTableCodeColumn().should('exist');
      productMeasurementUnitListPage.getPaginationBar().should('exist');

      // Act
      productMeasurementUnitListPage.findByText(dynamicFixtures.productMeasurementUnit.code);

      // Assert
      const firstRow = 0;
      productMeasurementUnitListPage
        .getTableRows()
        .should('exist')
        .and('contain', dynamicFixtures.productMeasurementUnit.code);
      productMeasurementUnitListPage.getTableEditButton(firstRow).should('exist');
      productMeasurementUnitListPage.getTableDeleteButton(firstRow).should('exist');
    });
  }
);
