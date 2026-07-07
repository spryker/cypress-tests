import { container } from '@utils';
import { YvesBudgetCrudStaticFixtures, YvesBudgetCrudDynamicFixtures } from '@interfaces/yves';
import { YvesBudgetListPage, YvesBudgetCreatePage, YvesBudgetUpdatePage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

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
    tags: ['@yves', '@purchasing-control', 'purchasing-control', 'spryker-core'],
  },
  (): void => {
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, and b2b-mp', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const budgetListPage = container.get(YvesBudgetListPage);
    const budgetCreatePage = container.get(YvesBudgetCreatePage);
    const budgetUpdatePage = container.get(YvesBudgetUpdatePage);

    let staticFixtures: YvesBudgetCrudStaticFixtures;
    let dynamicFixtures: YvesBudgetCrudDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.authorizedCustomer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('authorized company user should see budget list for a cost center', (): void => {
      budgetListPage.visitByCostCenterUuid(dynamicFixtures.costCenter.uuid);

      budgetListPage.getTableRows().should('contain', dynamicFixtures.preExistingBudget.name);
    });

    it('authorized company user should be able to create a budget', (): void => {
      budgetCreatePage.visitByCostCenterUuid(dynamicFixtures.costCenter.uuid);

      budgetCreatePage.fillName(staticFixtures.newBudgetName);
      budgetCreatePage.fillAmount(staticFixtures.budgetAmount);
      budgetCreatePage.selectCurrency(staticFixtures.budgetCurrency);
      budgetCreatePage.selectEnforcementRule(staticFixtures.budgetEnforcementRule);
      budgetCreatePage.fillStartDate(getBudgetStartDate());
      budgetCreatePage.fillEndDate(getBudgetEndDate());
      budgetCreatePage.submit();

      budgetCreatePage.getSuccessFlashMessage().should('be.visible');
    });

    it('authorized company user should be able to update a budget', (): void => {
      budgetUpdatePage.visitByUuid(dynamicFixtures.preExistingBudget.uuid, dynamicFixtures.costCenter.uuid);
      budgetUpdatePage.fillName(staticFixtures.updatedBudgetName);
      budgetUpdatePage.submit();

      budgetUpdatePage.getSuccessFlashMessage().should('be.visible');
      budgetListPage.visitByCostCenterUuid(dynamicFixtures.costCenter.uuid);
      budgetListPage.getTableRows().should('contain', staticFixtures.updatedBudgetName);
    });
  }
);
