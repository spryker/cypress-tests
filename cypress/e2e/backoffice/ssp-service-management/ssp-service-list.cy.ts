import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ServiceListPage } from '@pages/backoffice';
import { ServiceListStaticFixtures, ServiceListDynamicFixtures } from '@interfaces/backoffice';

describe(
  'Service List Page',
  {
    tags: [
      '@backoffice',
      '@ssp',
      '@service-management',
      'service-points',
      'product-offer-service-points',
      'self-service-portal',
      'spryker-core-back-office',
      'spryker-core',
    ],
  },
  () => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const userLoginScenario = container.get(UserLoginScenario);
    const serviceListPage = container.get(ServiceListPage);

    let dynamicFixtures: ServiceListDynamicFixtures;
    let staticFixtures: ServiceListStaticFixtures;

    retryableBefore((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach(() => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should display service list table with order containing service product', () => {
      serviceListPage.visit();

      serviceListPage.findServiceTableByName(dynamicFixtures.salesOrder?.order_items[0].name).then(() => {
        const orderReference = dynamicFixtures.salesOrder?.order_reference;
        const customerName = `${dynamicFixtures.customer.first_name} ${dynamicFixtures.customer.last_name}`;
        const company = dynamicFixtures.company?.name;
        const itemId = dynamicFixtures.salesOrder?.order_items[0].id_sales_order_item;
        const itemName = dynamicFixtures.salesOrder?.order_items[0].name;

        serviceListPage
          .getServiceListTable()
          .first()
          .within(() => {
            serviceListPage.getOrderReferenceHeader().should('exist').and('contain', 'Order Reference');
            serviceListPage.getCustomerHeader().should('exist').and('contain', 'Customer');
            serviceListPage.getCompanyHeader().should('exist').and('contain', 'Company');
            serviceListPage.getServiceHeader().should('exist').and('contain', 'Service');
            serviceListPage.getScheduledAtHeader().should('exist').and('contain', 'Time and Date');
            serviceListPage.getCreatedAtHeader().should('exist').and('contain', 'Created');
            serviceListPage.getActionsHeader().should('exist').and('contain', 'Actions');
          });

        serviceListPage.getFirstTableRow().within(() => {
          if (orderReference) {
            serviceListPage.getOrderReferenceCell().should('contain', orderReference);
          }

          if (customerName) {
            serviceListPage.getCustomerNameCell().should('contain', customerName);
          }

          if (company) {
            serviceListPage.getCompanyCell().should('contain', company);
          }

          serviceListPage.getServiceCell().should('contain', itemName);

          serviceListPage
            .getActionsCell()
            .should('contain', 'View')
            .find(serviceListPage.getViewButtonSelector())
            .should('exist')
            .and('have.attr', 'href')
            .and('include', '/self-service-portal/view-service?id-sales-order-item=');

          serviceListPage
            .getActionsCell()
            .find(serviceListPage.getViewButtonSelector())
            .should('have.attr', 'href')
            .and('include', `/self-service-portal/view-service?id-sales-order-item=${itemId}`);
        });
      });
    });
  }
);
