import { container } from '@utils';
import {
  CustomerGroupCompanyMembershipDynamicFixtures,
  CustomerGroupCompanyMembershipStaticFixtures,
} from '@interfaces/backoffice';
import { CustomerGroupFormPage, CustomerGroupListPage, CustomerGroupViewPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'customer group company membership',
  {
    tags: [
      '@backoffice',
      '@customer-group',
      '@customer-experience-management',
      'customer-experience-management',
      'customer-account-management',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because tests run only for suite', () => {});
      return;
    }

    const customerGroupFormPage = container.get(CustomerGroupFormPage);
    const customerGroupViewPage = container.get(CustomerGroupViewPage);
    const customerGroupListPage = container.get(CustomerGroupListPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: CustomerGroupCompanyMembershipStaticFixtures;
    let dynamicFixtures: CustomerGroupCompanyMembershipDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('backoffice user should be able to create a customer group with a customer, a company and a business unit', (): void => {
      customerGroupFormPage.visit();
      customerGroupFormPage.fillName(dynamicFixtures.newCustomerGroup.name);
      customerGroupFormPage.assignCustomer({
        idCustomer: dynamicFixtures.customer.id_customer,
        searchTerm: dynamicFixtures.customer.email,
      });
      customerGroupFormPage.assignCompany({
        idCompany: dynamicFixtures.company.id_company,
        searchTerm: dynamicFixtures.company.name,
      });
      customerGroupFormPage.assignBusinessUnit({
        idCompanyBusinessUnit: dynamicFixtures.businessUnit.id_company_business_unit,
        searchTerm: dynamicFixtures.businessUnit.name,
      });
      customerGroupFormPage.save();

      customerGroupListPage.getSuccessMessage().should('be.visible');
      customerGroupListPage.openViewPage(dynamicFixtures.newCustomerGroup.name);

      customerGroupViewPage.getCustomerTable().should('contain', dynamicFixtures.customer.last_name);
      customerGroupViewPage.getCompanyTable().should('contain', dynamicFixtures.company.name);
      customerGroupViewPage.getBusinessUnitTable().should('contain', dynamicFixtures.businessUnit.name);
      customerGroupViewPage.getCompanyTableCheckboxes().should('not.exist');
      customerGroupViewPage.getBusinessUnitTableCheckboxes().should('not.exist');
      customerGroupViewPage.getCompanyEditButton(dynamicFixtures.company.id_company).should('be.visible');
      customerGroupViewPage
        .getBusinessUnitEditButton(dynamicFixtures.businessUnit.id_company_business_unit)
        .should('be.visible');
    });

    it('backoffice user should be able to de-assign a company and a business unit from a customer group', (): void => {
      customerGroupFormPage.visitEditPage(dynamicFixtures.customerGroupWithMemberships.id_customer_group);
      customerGroupFormPage.deassignCompany(dynamicFixtures.company.id_company);
      customerGroupFormPage.deassignBusinessUnit(dynamicFixtures.businessUnit.id_company_business_unit);
      customerGroupFormPage.save();

      cy.url({ timeout: 20000 }).should(
        'include',
        customerGroupFormPage.getEditPageUrl(dynamicFixtures.customerGroupWithMemberships.id_customer_group)
      );
      customerGroupFormPage.getSuccessMessage().should('be.visible');
      customerGroupFormPage.getBusinessUnitsTab().should('have.class', 'active');

      customerGroupViewPage.visitViewPage(dynamicFixtures.customerGroupWithMemberships.id_customer_group);
      customerGroupViewPage.getCompanyTable().should('contain', dynamicFixtures.companyToKeep.name);
      customerGroupViewPage.getCompanyTable().should('not.contain', dynamicFixtures.company.name);
      customerGroupViewPage.getBusinessUnitTable().should('contain', dynamicFixtures.businessUnitToKeep.name);
      customerGroupViewPage.getBusinessUnitTable().should('not.contain', dynamicFixtures.businessUnit.name);
    });
  }
);
