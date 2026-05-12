import { container } from '@utils';
import { YvesCostCenterCrudStaticFixtures, YvesCostCenterCrudDynamicFixtures } from '@interfaces/yves';
import { YvesCostCenterListPage, YvesCostCenterCreatePage, YvesCostCenterUpdatePage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'purchasing control cost center crud',
  {
    tags: ['@yves', '@purchasing-control', 'purchasing-control', 'spryker-core'],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, b2b, and b2b-mp', () => {});
      return;
    }

    const customerLoginScenario = container.get(CustomerLoginScenario);
    const costCenterListPage = container.get(YvesCostCenterListPage);
    const costCenterCreatePage = container.get(YvesCostCenterCreatePage);
    const costCenterUpdatePage = container.get(YvesCostCenterUpdatePage);

    let staticFixtures: YvesCostCenterCrudStaticFixtures;
    let dynamicFixtures: YvesCostCenterCrudDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.authorizedCustomer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('authorized company user should see cost center list', (): void => {
      costCenterListPage.visit();

      costCenterListPage.assertCostCenterInTable(dynamicFixtures.preExistingCostCenter.name);
    });

    it('authorized company user should be able to create a cost center', (): void => {
      costCenterCreatePage.visit();

      costCenterCreatePage.fillName('New Cost Center');
      costCenterCreatePage.fillDescription('New cost center description');
      costCenterCreatePage.selectBusinessUnit(dynamicFixtures.businessUnit.id_company_business_unit);
      costCenterCreatePage.submit();

      costCenterCreatePage.assertSuccess();
    });

    it('authorized company user should be able to edit a cost center', (): void => {
      const updatedName = 'Updated Cost Center Name';

      costCenterUpdatePage.visitByUuid(dynamicFixtures.preExistingCostCenter.uuid);
      costCenterUpdatePage.fillName(updatedName);
      costCenterUpdatePage.submit();

      costCenterUpdatePage.assertSuccess();
      costCenterListPage.assertCostCenterInTable(updatedName);
    });

    it('authorized company user should be able to deactivate a cost center', (): void => {
      costCenterUpdatePage.visitByUuid(dynamicFixtures.preExistingCostCenter.uuid);
      costCenterUpdatePage.deactivate();
      costCenterUpdatePage.submit();

      costCenterUpdatePage.assertSuccess();

      costCenterUpdatePage.visitByUuid(dynamicFixtures.preExistingCostCenter.uuid);
      costCenterUpdatePage.assertIsInactive();
    });

    it('authorized company user should be able to reactivate a cost center', (): void => {
      costCenterUpdatePage.visitByUuid(dynamicFixtures.inactiveCostCenter.uuid);
      costCenterUpdatePage.activate();
      costCenterUpdatePage.submit();

      costCenterUpdatePage.assertSuccess();

      costCenterUpdatePage.visitByUuid(dynamicFixtures.inactiveCostCenter.uuid);
      costCenterUpdatePage.assertIsActive();
    });

    it('unauthorized company user should receive 403 when accessing cost center list', (): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.unauthorizedCustomer.email,
        password: staticFixtures.defaultPassword,
      });

      cy.visit('/company/cost-center', { failOnStatusCode: false });

      cy.url().should('include', '403');
    });
  }
);
