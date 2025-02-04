import { container } from '@utils';
import { ClaimListPage, ClaimCreatePage, ClaimDetailPage } from '@pages/yves';
import { ClaimStaticFixtures, ClaimDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe('claim management', { tags: ['@yves', '@claim'] }, (): void => {
  const claimListPage = container.get(ClaimListPage);
  const claimCreatePage = container.get(ClaimCreatePage);
  const claimDetailPage = container.get(ClaimDetailPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: ClaimStaticFixtures;
  let dynamicFixtures: ClaimDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
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
});
