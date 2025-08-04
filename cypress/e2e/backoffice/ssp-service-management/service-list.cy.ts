import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ServiceListPage } from '@pages/backoffice';
import { ServiceListStaticFixtures, ServiceListDynamicFixtures } from '@interfaces/backoffice';

describeForSsp('Service List Page', { tags: ['@backoffice', '@ssp', '@service-management'] }, () => {
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

    serviceListPage
      .find({
        searchQuery: dynamicFixtures.salesOrder?.order_items[0].name,
        tableUrl:
          '**/self-service-portal/list-service/table**' + dynamicFixtures.salesOrder?.order_items[0].name + '**',
      })
      .then(() => {
        serviceListPage.verifyServiceListPage({
          orderReference: dynamicFixtures.salesOrder?.order_reference,
          customerFullName: `${dynamicFixtures.customer.first_name} ${dynamicFixtures.customer.last_name}`,
          companyName: dynamicFixtures.company?.name,
          itemId: dynamicFixtures.salesOrder?.order_items[0].id_sales_order_item,
          itemName: dynamicFixtures.salesOrder?.order_items[0].name,
        });
      });
  });
});

function describeForSsp(title: string, options: { tags: string[] }, fn: () => void): void {
  (['suite'].includes(Cypress.env('repositoryId')) ? describe : describe.skip)(title, options, fn);
}
