import { container } from '@utils';
import { ClaimStaticFixtures, ClaimDynamicFixtures } from '@interfaces/backoffice';
import { ClaimDetailPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';


(['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'claim management',
    { tags: ['@yves', '@claim'] },
    (): void => {
        // const categoryListPage = container.get(CategoryListPage);
        const claimDetailPage = container.get(ClaimDetailPage);
        const userLoginScenario = container.get(UserLoginScenario);
        //
        let staticFixtures: ClaimStaticFixtures;
        let dynamicFixtures: ClaimDynamicFixtures;

        before((): void => {
            ({ staticFixtures, dynamicFixtures } = Cypress.env());
        });

        beforeEach((): void => {
            userLoginScenario.execute({
                username: staticFixtures.rootUser.username,
                password: staticFixtures.defaultPassword,
            });
        });

        it('can view general claim details', (): void => {
            claimDetailPage.visit(
                {
                    qs: {
                        "id-claim": dynamicFixtures.claim.id_claim
                    }
            });

            cy.log(JSON.stringify(dynamicFixtures.customer))

            claimDetailPage.assertClaimDetails({
                reference: dynamicFixtures.claim.reference,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                status: dynamicFixtures.claim.status,
                type: dynamicFixtures.claim.type,
                customer: {
                    firstName: dynamicFixtures.customer.first_name,
                    lastName: dynamicFixtures.customer.last_name,
                    email: dynamicFixtures.customer.email,
                    salutation: dynamicFixtures.customer.salutation,
                    companyName: dynamicFixtures.company.name,
                    businessUnitName: dynamicFixtures.businessUnit.name
                }
            })

        });
    })
