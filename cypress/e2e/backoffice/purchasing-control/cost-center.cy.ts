import { container } from '@utils';
import {
  BackofficeCostCenterCrudStaticFixtures,
  BackofficeCostCenterCrudDynamicFixtures,
} from '@interfaces/backoffice';
import { CostCenterListPage, CostCenterCreatePage, CostCenterEditPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'purchasing control cost center crud',
  {
    tags: ['@backoffice', '@purchasing-control', 'purchasing-control', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b, and b2b-mp', () => {});
      return;
    }

    const costCenterListPage = container.get(CostCenterListPage);
    const costCenterCreatePage = container.get(CostCenterCreatePage);
    const costCenterEditPage = container.get(CostCenterEditPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: BackofficeCostCenterCrudStaticFixtures;
    let dynamicFixtures: BackofficeCostCenterCrudDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('admin should be able to create a cost center', (): void => {
      costCenterListPage.waitForTable();
      costCenterListPage.clickCreateButton();

      costCenterCreatePage.fillName('Test Cost Center');
      costCenterCreatePage.fillDescription('Test description');
      costCenterCreatePage.selectCompany(dynamicFixtures.company.name);
      costCenterCreatePage.selectBusinessUnit(dynamicFixtures.businessUnit.name);
      costCenterCreatePage.submit();

      costCenterCreatePage.assertSuccess();
    });

    it('admin should be able to edit a cost center', (): void => {
      const updatedName = 'Updated Cost Center Name';

      costCenterEditPage.visitById(dynamicFixtures.preExistingCostCenter.id_cost_center);
      costCenterEditPage.fillName(updatedName);
      costCenterEditPage.submit();

      costCenterEditPage.assertSuccess();
      costCenterEditPage.getNameValue().should('equal', updatedName);
    });
  }
);
