import { container } from '@utils';
import { LoginPage, CompanyUserListPage } from '@pages/yves';
import {
    ManageCompanyUserRoleStaticFixtures,
    ManageCompanyUserDynamicFixtures
} from '@interfaces/yves';

describe('manage company user', { tags: ['@yves', '@customer-account-management'] }, (): void => {
    const loginPage = container.get(LoginPage);
    const companyUserListPage = container.get(CompanyUserListPage);

    let dynamicFixtures: ManageCompanyUserDynamicFixtures;
    let staticFixtures: ManageCompanyUserRoleStaticFixtures;

    before((): void => {
        ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    skipB2CIt('having permissions, should be able to disable a company user', (): void => {
        loginUserWithPermissions();
        companyUserListPage.visit();

        companyUserListPage.disableUser();
        companyUserListPage.assertTopUserIsDisabled();
    });

    skipB2CIt('having permissions, should be able to enable a company user', (): void => {
        loginUserWithPermissions();
        companyUserListPage.visit();

        companyUserListPage.enableUser();
        companyUserListPage.assertTopUserIsEnabled();
    });

    skipB2CIt('without permissions, should not be able to disable a company user', (): void => {
        loginUserWithoutPermissions();
        companyUserListPage.visit();

        companyUserListPage.disableUser();
        companyUserListPage.assertTopUserIsEnabled();
    });

    skipB2CIt('without permissions, should not be able to enable a company user', (): void => {
        loginUserWithoutPermissions();
        companyUserListPage.visit();

        companyUserListPage.enableUser();
        companyUserListPage.assertTopUserIsEnabled();
    });

    function loginUserWithPermissions(): void {
        loginPage.visit();
        loginPage.login({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
        });
    }

    function loginUserWithoutPermissions(): void {
        loginPage.visit();
        loginPage.login({
            email: dynamicFixtures.customer2.email,
            password: staticFixtures.defaultPassword,
        });
    }

    function skipB2CIt(description: string, testFn: () => void): void {
        (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it)(description, testFn);
    }
});
