import { container } from '@utils';
import { LoginPage, CompanyUserSelectPage } from '@pages/yves';
import {
    ManageCompanyUserRoleStaticFixtures,
    ManageCompanyUserDynamicFixtures
} from '@interfaces/yves';

describe('manage company user', { tags: ['@yves', '@customer-account-management'] }, (): void => {
    const loginPage = container.get(LoginPage);
    const companyUserSelectPage = container.get(CompanyUserSelectPage);

    let dynamicFixtures: ManageCompanyUserDynamicFixtures;
    let staticFixtures: ManageCompanyUserRoleStaticFixtures;

    before((): void => {
        ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    skipB2CIt('having permissions, should be able to disable a company user', (): void => {
        loginUserWithPermissions();
        companyUserSelectPage.visit();

        companyUserSelectPage.disableUser();
        companyUserSelectPage.assertTopUserIsDisabled();
    });
    //
    // skipB2CIt('having permissions, should be able to enable a company user', (): void => {
    //     loginUserWithPermissions();
    //     companyUserSelectPage.visit();
    //
    //     companyUserSelectPage.enableUser();
    //     companyUserSelectPage.assertTopUserIsEnabled();
    // });
    //
    // skipB2CIt('without permissions, should not be able to disable a company user', (): void => {
    //     loginUserWithoutPermissions();
    //     companyUserSelectPage.visit();
    //
    //     companyUserSelectPage.disableUser();
    //     companyUserSelectPage.assertTopUserIsDisabled();
    // });
    //
    // skipB2CIt('without permissions, should not be able to enable a company user', (): void => {
    //     loginUserWithoutPermissions();
    //     companyUserSelectPage.visit();
    //
    //     companyUserSelectPage.enableUser();
    //     companyUserSelectPage.assertTopUserIsEnabled();
    // });

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
