import { container } from '@utils';
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
    it.skip('skipped because until fixed at CC-37104', () => {});
    return;

    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp', () => {});
      return;
    }
    const userLoginScenario = container.get(UserLoginScenario);
    const serviceListPage = container.get(ServiceListPage);

    let dynamicFixtures: ServiceListDynamicFixtures;
    let staticFixtures: ServiceListStaticFixtures;

    before((): void => {
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
        serviceListPage.assertServiceListPage({
          orderReference: dynamicFixtures.salesOrder?.order_reference,
          customerFullName: `${dynamicFixtures.customer.first_name} ${dynamicFixtures.customer.last_name}`,
          companyName: dynamicFixtures.company?.name,
          itemId: dynamicFixtures.salesOrder?.order_items[0].id_sales_order_item,
          itemName: dynamicFixtures.salesOrder?.order_items[0].name,
        });
      });
    });
  }
);
