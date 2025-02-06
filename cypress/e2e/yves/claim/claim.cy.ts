import { container } from '@utils';
import { ClaimListPage, ClaimCreatePage, ClaimDetailPage, OrderDetailsPage, ClaimOrderPage } from '@pages/yves';
import { ClaimStaticFixtures, ClaimDynamicFixtures } from '@interfaces/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

(['suite', 'b2b'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(
    'claim management',
    { tags: ['@yves', '@claim'] },
    (): void => {
  const claimListPage = container.get(ClaimListPage);
  const claimCreatePage = container.get(ClaimCreatePage);
  const claimDetailPage = container.get(ClaimDetailPage);
  const orderDetailPage = container.get(OrderDetailsPage);
  const claimOrderPage = container.get(ClaimOrderPage);
  const customerLoginScenario = container.get(CustomerLoginScenario);

  let staticFixtures: ClaimStaticFixtures;
  let dynamicFixtures: ClaimDynamicFixtures;

  before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

    beforeEach((): void => {

        customerLoginScenario.execute({
            email: dynamicFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            withoutSession: true,
        });    });

  it('customer should be able to create and view a general claim', (): void => {
      claimListPage.visit();
      claimListPage.clickCreateClaimButton();

      staticFixtures.generalClaim.availableTypes = staticFixtures.claimTypes.general;
      claimCreatePage.assertPageLocation();
      claimCreatePage.createClaim(staticFixtures.generalClaim);

      claimDetailPage.assertPageLocation();
      cy.contains(claimCreatePage.getClaimCreatedMessage()).should('exist');

      var reference: string;
      cy.url().then((url) => {
          const urlParams = new URLSearchParams(url.split('?')[1]);
          reference = urlParams.get('reference');
      }).then(() => {
          claimDetailPage.assertClaimDetails({
              reference: reference,
              type: staticFixtures.generalClaim.type,
              subject: staticFixtures.generalClaim.subject,
              description: staticFixtures.generalClaim.description,
              status: staticFixtures.generalClaim.status,
              files: staticFixtures.generalClaim.files,
              date: new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit'
              }).replace(/([a-zA-Z]+)\s/, '$1. '),
              customer: {
                  firstName: dynamicFixtures.customer.first_name,
                  lastName: dynamicFixtures.customer.last_name,
                  email: dynamicFixtures.customer.email,
                  companyName: dynamicFixtures.company.name,
                  businessUnitName: dynamicFixtures.businessUnit.name
              }
          });
      });
  });

    it('customer should be able to create and view an order claim', (): void => {
        orderDetailPage.visit({
            qs: {
                id: dynamicFixtures.order.id_sales_order
            }
        });
        claimOrderPage.clickCreateClaimButton();

        claimCreatePage.assertPageLocation();
        staticFixtures.orderClaim.availableTypes = staticFixtures.claimTypes.order;
        claimCreatePage.createOrderClaim({...staticFixtures.orderClaim, orderReference: dynamicFixtures.order.order_reference});

        claimDetailPage.assertPageLocation();
        cy.contains(claimCreatePage.getClaimCreatedMessage()).should('exist');

        var reference: string;
        cy.url().then((url) => {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            reference = urlParams.get('reference');
        }).then(() => {
            claimDetailPage.assertOrderClaimDetails({
                reference: reference,
                type: staticFixtures.orderClaim.type,
                subject: staticFixtures.orderClaim.subject,
                description: staticFixtures.orderClaim.description,
                status: staticFixtures.orderClaim.status,
                files: staticFixtures.orderClaim.files,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit'
                }).replace(/([a-zA-Z]+)\s/, '$1. '),
                customer: {
                    firstName: dynamicFixtures.customer.first_name,
                    lastName: dynamicFixtures.customer.last_name,
                    email: dynamicFixtures.customer.email,
                    companyName: dynamicFixtures.company.name,
                    businessUnitName: dynamicFixtures.businessUnit.name
                },
                orderReference: dynamicFixtures.order.order_reference
            });
        });
    });
});
