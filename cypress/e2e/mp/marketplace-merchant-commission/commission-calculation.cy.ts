import { container } from '@utils';
import { CommissionCalculationDynamicFixtures, CommissionCalculationStaticFixtures } from '@interfaces/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { CatalogPage, ProductPage } from '@pages/yves';

/**
 * Marketplace Merchant Commission checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4260298796/Commissions+Cypress+Tests}
 */
(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'commission calculation',
  { tags: ['@marketplace-merchant-commission'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const salesIndexPage = container.get(SalesIndexPage);
    const salesDetailPage = container.get(SalesDetailPage);
    const salesOrdersPage = container.get(SalesOrdersPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const checkoutMpScenario = container.get(CheckoutMpScenario);
    const userLoginScenario = container.get(UserLoginScenario);
    const merchantUserLoginScenario = container.get(MerchantUserLoginScenario);

    let dynamicFixtures: CommissionCalculationDynamicFixtures;
    let staticFixtures: CommissionCalculationStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    it('merchant commissions should be calculated based on price/category conditions in Backoffice', (): void => {
      placeGuestOrder();

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      triggerLatestOrderToPayState();
      assertCommissionTotalsInBackoffice(staticFixtures.totalCommission);
    });

    it('merchant commissions should be calculated based on price/category conditions in Merchant Portal', (): void => {
      placeGuestOrder();

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      triggerLatestOrderToPayState();
      assertCommissionTotalsInBackoffice(staticFixtures.totalCommission);

      salesIndexPage.extractOrderIdFromUrl().then((idSalesOrder) => {
        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant1.username,
          password: staticFixtures.defaultPassword,
        });

        assertCommissionTotalsInMerchantPortal(idSalesOrder, staticFixtures.merchant1TotalCommission);

        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant2.username,
          password: staticFixtures.defaultPassword,
        });

        assertCommissionTotalsInMerchantPortal(idSalesOrder, staticFixtures.merchant2TotalCommission);
      });
    });

    it('merchant commissions should be refunded in Merchant Portal and Backoffice', (): void => {
      placeCustomerOrder();

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      triggerLatestOrderToPayState();
      assertCommissionTotalsInBackoffice(staticFixtures.totalCommission);

      salesIndexPage.extractOrderIdFromUrl().then((idSalesOrder) => {
        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant1.username,
          password: staticFixtures.defaultPassword,
        });

        refundMerchantOrder(`DE--${idSalesOrder}`);
        assertCommissionTotalsInMerchantPortal(idSalesOrder, '€0.00', staticFixtures.merchant1TotalCommission);

        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant2.username,
          password: staticFixtures.defaultPassword,
        });

        refundMerchantOrder(`DE--${idSalesOrder}`);
        assertCommissionTotalsInMerchantPortal(idSalesOrder, '€0.00', staticFixtures.merchant2TotalCommission);
      });

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      salesIndexPage.visit();
      salesIndexPage.view();
      assertCommissionTotalsInBackoffice('€0.00', staticFixtures.totalCommission);
    });

    function refundMerchantOrder(orderReference: string): void {
      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.ship });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.deliver });

      salesOrdersPage.visit();
      salesOrdersPage.update({ query: orderReference, action: ActionEnum.refund });
    }

    function placeCustomerOrder(): void {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

      checkoutMpScenario.execute({
        isGuest: false,
        idCustomerAddress: dynamicFixtures.address.id_customer_address,
        shouldTriggerOmsInCli: true,
      });
    }

    function placeGuestOrder(): void {
      addProductToCart(dynamicFixtures.concreteProduct1.sku, 2);
      addProductToCart(dynamicFixtures.concreteProduct2.sku, 2);
      addProductToCart(dynamicFixtures.concreteProduct3.sku, 2);

      checkoutMpScenario.execute({
        isGuest: true,
        shouldTriggerOmsInCli: true,
      });
    }

    function addProductToCart(sku: string, quantity: number): void {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: sku });
      productPage.addToCart({ quantity: quantity });
    }

    function triggerLatestOrderToPayState(): void {
      salesIndexPage.visit();
      salesIndexPage.view();
      salesDetailPage.triggerOms({ state: 'Pay' });
      salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });

      cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
    }

    function assertCommissionTotalsInBackoffice(totalCommission: string, totalRefundedCommission = '€0.00'): void {
      salesDetailPage.getTotalCommissionBlock().should('contains.text', totalCommission);
      salesDetailPage.getTotalRefundedCommissionBlock().should('contains.text', totalRefundedCommission);
    }

    function assertCommissionTotalsInMerchantPortal(
      idSalesOrder: string,
      totalCommission: string,
      totalRefundedCommission = '€0.00'
    ): void {
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      salesOrdersPage.visit();
      salesOrdersPage.find({ query: `DE--${idSalesOrder}` }).click();

      salesOrdersPage.getTotalCommissionBlock().should('contains.text', totalCommission);
      salesOrdersPage.getTotalRefundedCommissionBlock().should('contains.text', totalRefundedCommission);
    }
  }
);
