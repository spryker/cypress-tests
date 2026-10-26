import { container } from '@utils';
import {
  CompanyStructureCreationDynamicFixtures,
  CompanyStructureCreationStaticFixtures,
} from '@interfaces/backoffice';
import {
  ActionEnum,
  CompanyBusinessUnitCreatePage,
  CompanyCreatePage,
  CompanyListPage,
  CompanyRoleCreatePage,
  CompanyUserCreatePage,
  CompanyUserListPage,
} from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ImpersonateCustomerScenario } from '@scenarios/yves';

describe(
  'company structure creation',
  {
    tags: [
      '@backoffice',
      '@company-account',
      'company-account',
      'spryker-core-back-office',
      'spryker-core',
      'agent-assist',
      'acl',
    ],
  },
  (): void => {
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because company accounts exist only in suite, b2b and b2b-mp', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const impersonateCustomerScenario = container.get(ImpersonateCustomerScenario);
    const companyCreatePage = container.get(CompanyCreatePage);
    const companyListPage = container.get(CompanyListPage);
    const companyBusinessUnitCreatePage = container.get(CompanyBusinessUnitCreatePage);
    const companyRoleCreatePage = container.get(CompanyRoleCreatePage);
    const companyUserCreatePage = container.get(CompanyUserCreatePage);
    const companyUserListPage = container.get(CompanyUserListPage);

    let staticFixtures: CompanyStructureCreationStaticFixtures;
    let dynamicFixtures: CompanyStructureCreationDynamicFixtures;

    let companyName: string;
    let businessUnitName: string;
    let roleName: string;
    let companyUserEmail: string;
    let companyUserLastName: string;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());

      const unique = Date.now();
      companyName = `Company${unique}`;
      businessUnitName = `BusinessUnit${unique}`;
      roleName = `Role${unique}`;
      companyUserEmail = `company.user.${unique}@spryker.local`;
      companyUserLastName = `User${unique}`;
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a back office user when a company, its business unit, its role and a company user are created then the company user list shows the user under its company', (): void => {
      // Act
      companyCreatePage.visit();
      companyCreatePage.create(companyName);

      // A company is created inactive and pending, and only an active approved one can carry users.
      companyListPage.visit();
      companyListPage.update({ query: companyName, action: ActionEnum.activate });
      companyListPage.visit();
      companyListPage.update({ query: companyName, action: ActionEnum.approve });

      companyBusinessUnitCreatePage.visit();
      companyBusinessUnitCreatePage.create({ companyName: companyName, name: businessUnitName });

      companyRoleCreatePage.visit();
      companyRoleCreatePage.create({
        companyName: companyName,
        name: roleName,
        permissionNames: staticFixtures.companyUserRolePermissionNames,
      });

      companyUserCreatePage.visit();
      companyUserCreatePage.create({
        companyName: companyName,
        businessUnitName: businessUnitName,
        roleName: roleName,
        email: companyUserEmail,
        salutation: 'Ms',
        firstName: 'Company',
        lastName: companyUserLastName,
        gender: 'Female',
      });

      // Assert
      companyUserListPage.visit();
      companyUserListPage.findByCompanyName(companyName).should('contain.text', companyUserLastName);
    });

    it('given the company user created above when an agent impersonates it on the storefront then it reaches the pages its role allows and no others', (): void => {
      // Arrange
      // Nothing knows the new company user's password, so the agent switches into their session.
      impersonateCustomerScenario.execute({
        agentUsername: dynamicFixtures.agentUser.username,
        agentPassword: staticFixtures.defaultPassword,
        customerEmail: companyUserEmail,
      });

      // Act
      cy.visit(staticFixtures.companyUserPagePath, { failOnStatusCode: false });

      // Assert
      cy.url().should('include', staticFixtures.companyUserPagePath);

      // Act
      cy.visit(staticFixtures.companyRolePagePath, { failOnStatusCode: false });

      // Assert
      cy.url().should('include', '403');
    });
  }
);
