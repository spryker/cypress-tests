import { container } from '../../../../support/utils/inversify/inversify.config';
import { SalesDetailPage, SalesIndexPage, SalesReturnGuiCreatePage } from '../../../../support/pages/backoffice';
import { CheckoutScenario, CustomerLoginScenario } from '../../../../support/scenarios/yves';
import {
  CreateReturnByUserDynamicFixtures,
  CreateReturnByUserStaticFixtures,
} from '../../../../support/types/yves/order-managment/return';
import { UserLoginScenario } from '../../../../support/scenarios/backoffice';
import { MultiCartPage } from '../../../../support/pages/yves';

describe('create return by user', { tags: ['@order-management'] }, (): void => {
  const multiCartPage: MultiCartPage = container.get(MultiCartPage);
  const salesIndexPage: SalesIndexPage = container.get(SalesIndexPage);
  const salesDetailPage: SalesDetailPage = container.get(SalesDetailPage);
  const salesReturnGuiCreatePage: SalesReturnGuiCreatePage = container.get(SalesReturnGuiCreatePage);
  const customerLoginScenario: CustomerLoginScenario = container.get(CustomerLoginScenario);
  const userLoginScenario: UserLoginScenario = container.get(UserLoginScenario);
  const checkoutScenario: CheckoutScenario = container.get(CheckoutScenario);

  let staticFixtures: CreateReturnByUserStaticFixtures;
  let dynamicFixtures: CreateReturnByUserDynamicFixtures;

  before((): void => {
    ({ staticFixtures, dynamicFixtures } = Cypress.env());
  });

  beforeEach((): void => {
    customerLoginScenario.execute(dynamicFixtures.customer.email, staticFixtures.defaultPassword);
  });

  it('should be able to create return from (from shipped order state)', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart(dynamicFixtures.quoteOne.name);
    checkoutScenario.execute();

    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    salesIndexPage.visit();
    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });

  it('should be able to create return from (from delivery order state)', (): void => {
    multiCartPage.visit();
    multiCartPage.selectCart(dynamicFixtures.quoteTwo.name);
    checkoutScenario.execute();

    userLoginScenario.execute(dynamicFixtures.rootUser.username, staticFixtures.defaultPassword);

    salesIndexPage.visit();
    salesIndexPage.viewLastPlacedOrder();
    salesDetailPage.triggerOms('Pay');
    salesDetailPage.triggerOms('Skip timeout');
    salesDetailPage.triggerOms('skip picking');
    salesDetailPage.triggerOms('Ship');
    salesDetailPage.triggerOms('Stock update');

    salesDetailPage.createReturn();
    salesReturnGuiCreatePage.createReturnForAllOrderItems();

    cy.contains('Return was successfully created.');
  });
});
