import { container } from '@utils';
import {
  BackofficeCostCenterCrudStaticFixtures,
  BackofficeCostCenterCrudDynamicFixtures,
} from '@interfaces/backoffice';
import { CostCenterListPage, CostCenterCreatePage, BackofficeBudgetCreatePage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getBudgetStartDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);

  return formatDate(date);
}

function getBudgetEndDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 4);
  date.setDate(0);

  return formatDate(date);
}

describe(
  'purchasing control cost center and budget',
  {
    tags: ['@backoffice', '@purchasing-control', 'purchasing-control', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, and b2b-mp', () => {});
      return;
    }

    const costCenterListPage = container.get(CostCenterListPage);
    const costCenterCreatePage = container.get(CostCenterCreatePage);
    const budgetCreatePage = container.get(BackofficeBudgetCreatePage);
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

    it('backoffice user should be able to create a cost center and a budget for a cost center', (): void => {
      costCenterListPage.waitForTable();
      costCenterListPage.clickCreateButton();

      costCenterCreatePage.fillName(staticFixtures.newCostCenterName);
      costCenterCreatePage.fillDescription(staticFixtures.newCostCenterDescription);
      costCenterCreatePage.selectCompany(dynamicFixtures.company.name);
      costCenterCreatePage.selectBusinessUnit(dynamicFixtures.businessUnit.name);
      costCenterCreatePage.submit();

      costCenterCreatePage.getSuccessMessage().should('be.visible');

      budgetCreatePage.visitByCostCenter(dynamicFixtures.preExistingCostCenter.id_cost_center);
      budgetCreatePage.fillName(staticFixtures.newBudgetName);
      budgetCreatePage.fillAmount(staticFixtures.budgetAmount);
      budgetCreatePage.selectCurrency(staticFixtures.budgetCurrency);
      budgetCreatePage.selectEnforcementRule(staticFixtures.budgetEnforcementRule);
      budgetCreatePage.fillStartDate(getBudgetStartDate());
      budgetCreatePage.fillEndDate(getBudgetEndDate());
      budgetCreatePage.submit();

      budgetCreatePage.getSuccessMessage().should('be.visible');
    });
  }
);
