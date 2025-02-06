import {container} from '@utils';
import {ClaimListPage, ClaimCreatePage, ClaimDetailPage} from '@pages/yves';
import {ClaimStaticFixtures, ClaimDynamicFixtures} from '@interfaces/yves';
import {CustomerLoginScenario} from '@scenarios/yves';
import {CustomerLogoutScenario} from '@scenarios/yves';

describe('claim management', {tags: ['@yves', '@claim']}, (): void => {
    const claimListPage = container.get(ClaimListPage);
    const claimCreatePage = container.get(ClaimCreatePage);
    const claimDetailPage = container.get(ClaimDetailPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);

    let staticFixtures: ClaimStaticFixtures;
    let dynamicFixtures: ClaimDynamicFixtures;

    before((): void => {
        ({staticFixtures, dynamicFixtures} = Cypress.env());
    });

    it('customer should be able to create a general claim', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.clickCreateClaimButton();

        claimCreatePage.createClaim(staticFixtures.claim);

        claimDetailPage.assertPageLocation();
        cy.contains(claimCreatePage.getClaimCreatedMessage()).should('exist');
    });

    it('customer should be able to cancel a general claim', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.clickCreateClaimButton();

        claimCreatePage.createClaim(staticFixtures.claim);

        claimDetailPage.assertPageLocation();
        claimDetailPage.clickCancelClaimButton();

        cy.get(claimDetailPage.getPendingClaimStatusSelector()).should('exist');
    });

    it('customer should not be able to cancel a claim if he is now owner', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.clickCreateClaimButton();

        claimCreatePage.createClaim(staticFixtures.claim);

        claimDetailPage.assertPageLocation();

        customerLogoutScenario.execute();

        customerLoginScenario.execute({
            email: dynamicFixtures.customer2.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();
        claimListPage.openLatestClaimDetailsPage();

        claimDetailPage.getCancelClaimButton().should('not.exist');
    });

    it('customer with corresponding permission can see claims created by other customers withing the same business unit', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.clickCreateClaimButton();

        claimCreatePage.createClaim(staticFixtures.claim);

        claimDetailPage.assertPageLocation();

        customerLogoutScenario.execute();

        customerLoginScenario.execute({
            email: dynamicFixtures.customer2.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.visit();
        claimListPage.openLatestClaimDetailsPage();

        claimDetailPage.assertPageLocation();
    });

    it('customer with corresponding permission can see claims created by other customers withing the same company', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.clickCreateClaimButton();

        claimCreatePage.createClaim(staticFixtures.claim);

        claimDetailPage.assertPageLocation();

        customerLogoutScenario.execute();

        customerLoginScenario.execute({
            email: dynamicFixtures.customer6.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.visit();
        claimListPage.openLatestClaimDetailsPage();

        claimDetailPage.assertPageLocation();
    });

    it('customer without corresponding permission shoudn\'t see claims created by other customers withing the same business unit', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer3.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.clickCreateClaimButton();

        claimCreatePage.createClaim(staticFixtures.claim);

        claimDetailPage.assertPageLocation();

        customerLogoutScenario.execute();

        customerLoginScenario.execute({
            email: dynamicFixtures.customer4.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();
        claimListPage.assertPageLocation();
        claimListPage.assetPageHasNoClaims();
    });

    it('customer with corresponding permission can see claims created by other customers withing the same business unit', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer3.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.clickCreateClaimButton();

        claimCreatePage.createClaim(staticFixtures.claim);

        claimDetailPage.assertPageLocation();

        customerLogoutScenario.execute();

        customerLoginScenario.execute({
            email: dynamicFixtures.customer5.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.visit();
        claimListPage.openLatestClaimDetailsPage();

        claimDetailPage.assertPageLocation();
    });

    it('customer should not be able to create a claim if he has no permission', (): void => {
        customerLoginScenario.execute({
            email: dynamicFixtures.customer4.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });

        claimListPage.visit();

        claimListPage.getCreateClaimButton().should('not.exist');
    });
});
