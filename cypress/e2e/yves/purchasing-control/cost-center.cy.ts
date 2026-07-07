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
    if (['b2c', 'b2c-mp', 'b2b'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite, and b2b-mp', () => {});
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

      costCenterListPage.visitFilteredByName(dynamicFixtures.preExistingCostCenter.name);
      costCenterListPage.getTableRows().should('contain', dynamicFixtures.preExistingCostCenter.name);
    });

    it('authorized company user should be able to create a cost center', (): void => {
      costCenterCreatePage.visit();

      costCenterCreatePage.fillName(staticFixtures.newCostCenterName);
      costCenterCreatePage.fillDescription(staticFixtures.newCostCenterDescription);
      costCenterCreatePage.selectBusinessUnit(dynamicFixtures.businessUnit.id_company_business_unit);
      costCenterCreatePage.submit();

      costCenterCreatePage.getSuccessFlashMessage().should('be.visible');
    });

    it('authorized company user should be able to edit a cost center', (): void => {
      costCenterUpdatePage.visitByUuid(dynamicFixtures.preExistingCostCenter.uuid);
      costCenterUpdatePage.fillName(staticFixtures.updatedCostCenterName);
      costCenterUpdatePage.submit();

      costCenterUpdatePage.getSuccessFlashMessage().should('be.visible');
      costCenterListPage.visitFilteredByName(staticFixtures.updatedCostCenterName);
      costCenterListPage.getTableRows().should('contain', staticFixtures.updatedCostCenterName);
    });

    it('authorized company user should be able to deactivate a cost center', (): void => {
      costCenterUpdatePage.visitByUuid(dynamicFixtures.preExistingCostCenter.uuid);
      costCenterUpdatePage.deactivate();
      costCenterUpdatePage.submit();

      costCenterUpdatePage.getSuccessFlashMessage().should('be.visible');

      costCenterUpdatePage.visitByUuid(dynamicFixtures.preExistingCostCenter.uuid);
      costCenterUpdatePage.getIsActiveCheckbox().should('not.be.checked');
    });

    it('authorized company user should be able to reactivate a cost center', (): void => {
      costCenterUpdatePage.visitByUuid(dynamicFixtures.inactiveCostCenter.uuid);
      costCenterUpdatePage.activate();
      costCenterUpdatePage.submit();

      costCenterUpdatePage.getSuccessFlashMessage().should('be.visible');

      costCenterUpdatePage.visitByUuid(dynamicFixtures.inactiveCostCenter.uuid);
      costCenterUpdatePage.getIsActiveCheckbox().should('be.checked');
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
