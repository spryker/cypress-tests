import { container } from '@utils';
import { BackofficeBudgetCrudStaticFixtures, BackofficeBudgetCrudDynamicFixtures } from '@interfaces/backoffice';
import { BackofficeBudgetListPage, BackofficeBudgetCreatePage, BackofficeBudgetEditPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'purchasing control budget crud',
  {
    tags: ['@backoffice', '@purchasing-control', 'purchasing-control', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b, and b2b-mp', () => {});
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

    it('admin should be able to create a budget for a cost center', (): void => {
      budgetCreatePage.visitByCostCenter(dynamicFixtures.costCenter.id_cost_center);

      budgetCreatePage.fillName('Q1 Budget');
      budgetCreatePage.fillAmount('100000');
      budgetCreatePage.selectCurrency('EUR');
      budgetCreatePage.selectEnforcementRule('block');
      budgetCreatePage.fillStartDate('2026-01-01');
      budgetCreatePage.fillEndDate('2026-03-31');
      budgetCreatePage.submit();

      budgetCreatePage.assertSuccess();
    });

    it('admin should see budget in the budget list after creation', (): void => {
      budgetListPage.visitByCostCenter(dynamicFixtures.costCenter.id_cost_center);
      budgetListPage.assertBudgetInTable(dynamicFixtures.preExistingBudget.name);
    });

    it('admin should be able to edit a budget', (): void => {
      const updatedName = 'Updated Budget Name';

      budgetEditPage.visitById(dynamicFixtures.preExistingBudget.id_budget, dynamicFixtures.costCenter.id_cost_center);
      budgetEditPage.fillName(updatedName);
      budgetEditPage.submit();

      budgetEditPage.assertSuccess();
      budgetListPage.assertBudgetInTable(updatedName);
    });
  }
);
