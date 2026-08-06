import { container } from '@utils';
import { BackofficeBudgetCrudStaticFixtures, BackofficeBudgetCrudDynamicFixtures } from '@interfaces/backoffice';
import { BackofficeBudgetListPage, BackofficeBudgetCreatePage, BackofficeBudgetEditPage } from '@pages/backoffice';
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
  'purchasing control budget crud',
  {
    tags: ['@backoffice', '@purchasing-control', 'purchasing-control', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, and b2b-mp', () => {});
      return;
    }

    const budgetListPage = container.get(BackofficeBudgetListPage);
    const budgetCreatePage = container.get(BackofficeBudgetCreatePage);
    const budgetEditPage = container.get(BackofficeBudgetEditPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: BackofficeBudgetCrudStaticFixtures;
    let dynamicFixtures: BackofficeBudgetCrudDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user should be able to create a budget for a cost center', (): void => {
      budgetCreatePage.visitByCostCenter(dynamicFixtures.costCenter.id_cost_center);

      budgetCreatePage.fillName(staticFixtures.newBudgetName);
      budgetCreatePage.fillAmount(staticFixtures.budgetAmount);
      budgetCreatePage.selectCurrency(staticFixtures.budgetCurrency);
      budgetCreatePage.selectEnforcementRule(staticFixtures.budgetEnforcementRule);
      budgetCreatePage.fillStartDate(getBudgetStartDate());
      budgetCreatePage.fillEndDate(getBudgetEndDate());
      budgetCreatePage.submit();

      budgetCreatePage.getSuccessMessage().should('be.visible');
    });

    it('backoffice user should see budget in the budget list after creation', (): void => {
      budgetListPage.visitByCostCenter(dynamicFixtures.costCenter.id_cost_center);
      budgetListPage.getTableBody().should('contain', dynamicFixtures.preExistingBudget.name);
    });

    it('backoffice user should be able to edit a budget', (): void => {
      budgetEditPage.visitById(dynamicFixtures.preExistingBudget.id_budget, dynamicFixtures.costCenter.id_cost_center);
      budgetEditPage.fillName(staticFixtures.updatedBudgetName);
      budgetEditPage.submit();

      budgetEditPage.getSuccessMessage().should('be.visible');
      budgetListPage.getTableBody().should('contain', staticFixtures.updatedBudgetName);
    });
  }
);
