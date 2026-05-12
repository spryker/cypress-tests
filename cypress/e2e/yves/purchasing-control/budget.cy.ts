import { container } from '@utils';
import { YvesBudgetCrudStaticFixtures, YvesBudgetCrudDynamicFixtures } from '@interfaces/yves';
import { YvesBudgetListPage, YvesBudgetCreatePage, YvesBudgetUpdatePage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'purchasing control budget crud',
  {
    tags: ['@yves', '@purchasing-control', 'purchasing-control', 'spryker-core'],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b, and b2b-mp', () => {});
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

      budgetListPage.assertBudgetInTable(dynamicFixtures.preExistingBudget.name);
    });

    it('authorized company user should be able to create a budget', (): void => {
      budgetCreatePage.visitByCostCenterUuid(dynamicFixtures.costCenter.uuid);

      budgetCreatePage.fillName('Q2 Budget');
      budgetCreatePage.fillAmount('50000');
      budgetCreatePage.selectCurrency('EUR');
      budgetCreatePage.selectEnforcementRule('block');
      budgetCreatePage.fillStartDate('2026-04-01');
      budgetCreatePage.fillEndDate('2026-06-30');
      budgetCreatePage.submit();

      budgetCreatePage.assertSuccess();
    });

    it('authorized company user should be able to update a budget', (): void => {
      const updatedName = 'Updated Budget Name';

      budgetUpdatePage.visitByUuid(dynamicFixtures.preExistingBudget.uuid, dynamicFixtures.costCenter.uuid);
      budgetUpdatePage.fillName(updatedName);
      budgetUpdatePage.submit();

      budgetUpdatePage.assertSuccess();
      budgetListPage.assertBudgetInTable(updatedName);
    });
  }
);
