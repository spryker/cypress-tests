import { container } from '@utils';
import { ClaimStaticFixtures, ClaimDynamicFixtures } from '@interfaces/backoffice';
import { ClaimDetailPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';


(['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'claim management',
    { tags: ['@yves', '@claim'] },
    (): void => {
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
                        "id-claim": dynamicFixtures.generalClaim.id_claim
                    }
            });

            claimDetailPage.assertClaimDetails({
                reference: dynamicFixtures.generalClaim.reference,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                status: dynamicFixtures.generalClaim.status,
                type: dynamicFixtures.generalClaim.type,
                store: dynamicFixtures.generalClaim.store.name,
                subject: dynamicFixtures.generalClaim.subject,
                description: dynamicFixtures.generalClaim.description,
                files: dynamicFixtures.generalClaim.files.map(file => ({
                    file_name: file.file_name,
                    size: file.file_info[0].size,
                    extension: file.file_info[0].extension
                })),
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

        it('can view order claim details', (): void => {
            claimDetailPage.visit(
                {
                    qs: {
                        "id-claim": dynamicFixtures.orderClaim.id_claim
                    }
                });

            claimDetailPage.assertClaimDetails({
                reference: dynamicFixtures.orderClaim.reference,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                order: {
                    reference: dynamicFixtures.orderClaim.order.order_reference
                },
                status: dynamicFixtures.orderClaim.status,
                type: dynamicFixtures.orderClaim.type,
                store: dynamicFixtures.orderClaim.store.name,
                subject: dynamicFixtures.orderClaim.subject,
                description: dynamicFixtures.orderClaim.description,
                files: dynamicFixtures.orderClaim.files.map(file => ({
                    file_name: file.file_name,
                    size: file.file_info[0].size,
                    extension: file.file_info[0].extension
                })),
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

        it('user can fill and submit the comment form', (): void => {
            claimDetailPage.visit({
                qs: {
                    "id-claim": dynamicFixtures.generalClaim.id_claim
                }
            });

            // Fill in the form
            cy.get('textarea[name="message"]').type('This is a test comment.');

            // Submit the form
            cy.get('form[action="/comment-gui/comment/add"]').submit();

            // Verify the form submission
            cy.url().should('include', '/claim/detail?id-claim=' + dynamicFixtures.generalClaim.id_claim);
            cy.contains('This is a test comment.').should('exist');
        });
    })
