import { container } from '@utils';
import { RequestManagementDynamicFixtures, RequestManagementStaticFixtures } from '@interfaces/yves';
import {
  CompanyUserSelectPage,
  MerchantRelationRequestDetailsPage,
  MerchantRelationRequestIndexPage,
} from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

/**
 * Merchant Relation Requests & Enhanced Merchant Relations checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4105896492/Business+Journey+B2B+Marketplace+-+to+automate}
 */
(['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'request management',
  { tags: ['@yves', '@merchant-b2b-contract-requests'] },
  (): void => {
    const companyUserSelectPage = container.get(CompanyUserSelectPage);
    const merchantRelationRequestIndexPage = container.get(MerchantRelationRequestIndexPage);
    const merchantRelationRequestDetailsPage = container.get(MerchantRelationRequestDetailsPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let dynamicFixtures: RequestManagementDynamicFixtures;
    let staticFixtures: RequestManagementStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      companyUserSelectPage.visit();
    });

    it('company user should be able to see decision note from rejected request', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.filterRequests({ status: 'rejected' });
      merchantRelationRequestIndexPage.openFirstRequest();

      cy.contains(staticFixtures.decisionNote);
    });

    it('company user should be able to filter MR requests by status', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });
      const statuses = ['Pending', 'Canceled', 'Approved', 'Rejected'];

      statuses.forEach((status: string): void => {
        merchantRelationRequestIndexPage.visit();
        merchantRelationRequestIndexPage.filterRequests({ status: status.toLowerCase() });
        const foundRequest = merchantRelationRequestIndexPage.getFirstRequest();

        foundRequest.should('contain', status);
        foundRequest.should('contain', dynamicFixtures.merchant1.name);
        foundRequest.should('contain', dynamicFixtures.customer.first_name + ' ' + dynamicFixtures.customer.last_name);
        foundRequest.should('contain', dynamicFixtures.businessUnit1FromCompany1.name);
      });
    });

    skipB2BIt('company user should be able to filter MR requests by merchant', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany2.id_company_user,
      });
      const merchants = [dynamicFixtures.merchant1, dynamicFixtures.merchant2];

      merchants.forEach((merchant): void => {
        merchantRelationRequestIndexPage.visit();
        merchantRelationRequestIndexPage.filterRequests({ idMerchant: merchant.id_merchant });
        const foundRequest = merchantRelationRequestIndexPage.getFirstRequest();

        foundRequest.should('contain', 'Canceled');
        foundRequest.should('contain', merchant.name);
        foundRequest.should('contain', dynamicFixtures.customer.first_name + ' ' + dynamicFixtures.customer.last_name);
        foundRequest.should('contain', dynamicFixtures.businessUnit1FromCompany2.name);
      });
    });

    it('company user should be able to filter MR requests by business unit owner', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany2.id_company_user,
      });
      const businessUnits = [dynamicFixtures.businessUnit1FromCompany2, dynamicFixtures.businessUnit2FromCompany2];

      businessUnits.forEach((businessUnit): void => {
        merchantRelationRequestIndexPage.visit();
        merchantRelationRequestIndexPage.filterRequests({
          idMerchant: dynamicFixtures.merchant3.id_merchant,
          idBusinessUnitOwner: businessUnit.id_company_business_unit,
        });

        const foundRequest = merchantRelationRequestIndexPage.getFirstRequest();

        foundRequest.should('contain', 'Approved');
        foundRequest.should('contain', dynamicFixtures.merchant3.name);
        foundRequest.should('contain', dynamicFixtures.customer.first_name + ' ' + dynamicFixtures.customer.last_name);
        foundRequest.should('contain', businessUnit.name);
      });
    });

    it('company user from same company should be able to see requests from another user', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.getFirstRequest().should('exist');
    });

    it('company user from same company should not be able to cancel request from another user', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser2FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.filterRequests({ status: 'pending' });
      merchantRelationRequestIndexPage.openFirstRequest();

      merchantRelationRequestDetailsPage.getCancelButton().should('not.exist');
    });

    it('company user should not be able to cancel request from canceled status', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.filterRequests({ status: 'canceled' });
      merchantRelationRequestIndexPage.openFirstRequest();

      merchantRelationRequestDetailsPage.getCancelButton().should('not.exist');
    });

    it('company user should not be able to cancel request from approved status', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.filterRequests({ status: 'approved' });
      merchantRelationRequestIndexPage.openFirstRequest();

      merchantRelationRequestDetailsPage.getCancelButton().should('not.exist');
    });

    it('company user should not be able to cancel request from rejected status', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.filterRequests({ status: 'rejected' });
      merchantRelationRequestIndexPage.openFirstRequest();

      merchantRelationRequestDetailsPage.getCancelButton().should('not.exist');
    });

    it('company user should be able to cancel request from pending status', (): void => {
      companyUserSelectPage.selectBusinessUnit({
        idCompanyUser: dynamicFixtures.companyUser1FromCompany1.id_company_user,
      });

      merchantRelationRequestIndexPage.visit();
      merchantRelationRequestIndexPage.filterRequests({ status: 'pending' });
      merchantRelationRequestIndexPage.openFirstRequest();

      merchantRelationRequestDetailsPage.getCancelButton().should('exist');
      merchantRelationRequestDetailsPage.getCancelButton().click();

      merchantRelationRequestIndexPage.assertPageLocation();
    });

    function skipB2BIt(description: string, testFn: () => void): void {
      (Cypress.env('repositoryId') === 'b2b' ? it.skip : it)(description, testFn);
    }
  }
);
