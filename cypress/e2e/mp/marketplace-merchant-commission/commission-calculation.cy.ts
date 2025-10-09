import { container } from '@utils';
import { CommissionCalculationDynamicFixtures, CommissionCalculationStaticFixtures } from '@interfaces/mp';
import { CheckoutMpScenario, CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { SalesDetailPage, SalesIndexPage } from '@pages/backoffice';
import { MerchantUserLoginScenario } from '@scenarios/mp';
import { ActionEnum, SalesOrdersPage } from '@pages/mp';
import { CatalogPage, MultiCartPage, ProductPage } from '@pages/yves';

/**
 * Marketplace Merchant Commission checklists: {@link https://spryker.atlassian.net/wiki/spaces/CCS/pages/4260298796/Commissions+Cypress+Tests}
 */
(['b2c', 'b2b'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
  'commission calculation',
  { tags: ['@mp', '@marketplace-merchant-commission', 'marketplace-merchant-commission', 'marketplace-order-management', 'order-management', 'state-machine', 'marketplace-merchant', 'refunds', 'marketplace-merchantportal-core', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const multiCartPage = container.get(MultiCartPage);
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

    it('merchant commissions for product without category should not be calculated', (): void => {
      placeGuestOrder([dynamicFixtures.concreteProduct4.sku]);

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      triggerLatestOrderToPayState();
      assertCommissionTotalsInBackoffice('€0.00');
    });

    it('merchant commissions for product from another merchant should not be calculated', (): void => {
      placeGuestOrder([dynamicFixtures.concreteProduct5.sku]);

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      triggerLatestOrderToPayState();
      assertCommissionTotalsInBackoffice('€0.00');
    });

    it('merchant commissions should be calculated based on price/category conditions in Backoffice', (): void => {
      placeGuestOrder([
        dynamicFixtures.concreteProduct1.sku,
        dynamicFixtures.concreteProduct2.sku,
        dynamicFixtures.concreteProduct3.sku,
      ]);

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      triggerLatestOrderToPayState();
      assertCommissionTotalsInBackoffice(staticFixtures.totalCommission);
    });

    it('merchant commissions should be calculated based on price/category conditions in Merchant Portal', (): void => {
      placeGuestOrder([
        dynamicFixtures.concreteProduct1.sku,
        dynamicFixtures.concreteProduct2.sku,
        dynamicFixtures.concreteProduct3.sku,
      ]);

      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      triggerLatestOrderToPayState();
      assertCommissionTotalsInBackoffice(staticFixtures.totalCommission);

      salesIndexPage.getOrderReference().then((orderReference) => {
        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant1.username,
          password: staticFixtures.defaultPassword,
        });

        assertCommissionTotalsInMerchantPortal(orderReference, staticFixtures.merchant1TotalCommission);

        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant2.username,
          password: staticFixtures.defaultPassword,
        });

        assertCommissionTotalsInMerchantPortal(orderReference, staticFixtures.merchant2TotalCommission);
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

      salesIndexPage.getOrderReference().then((orderReference) => {
        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant1.username,
          password: staticFixtures.defaultPassword,
        });

        refundMerchantOrder(orderReference);
        assertCommissionTotalsInMerchantPortal(orderReference, '€0.00', staticFixtures.merchant1TotalCommission);

        merchantUserLoginScenario.execute({
          username: dynamicFixtures.merchantUserFromMerchant2.username,
          password: staticFixtures.defaultPassword,
        });

        refundMerchantOrder(orderReference);
        assertCommissionTotalsInMerchantPortal(orderReference, '€0.00', staticFixtures.merchant2TotalCommission);
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

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000); // Refund (per-item) operation takes time to be processed
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

    function placeGuestOrder(skus: string[]): void {
      const isB2bMp = ['b2b-mp'].includes(Cypress.env('repositoryId'));
      if (isB2bMp) {
        customerLoginScenario.execute({
          email: dynamicFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });

        multiCartPage.visit();
        multiCartPage.createCart();
      }

      skus.forEach((sku) => addProductToCart(sku, 2));

      checkoutMpScenario.execute({
        isGuest: !isB2bMp,
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
      salesDetailPage.triggerOms({ state: 'skip grace period', shouldTriggerOmsInCli: true });
      salesDetailPage.triggerOms({ state: 'Pay' });
      salesDetailPage.triggerOms({ state: 'skip picking', shouldTriggerOmsInCli: true });

      cy.runCliCommands(['console oms:check-condition', 'console oms:check-timeout']);
    }

    function assertCommissionTotalsInBackoffice(totalCommission: string, totalRefundedCommission = '€0.00'): void {
      salesDetailPage.getTotalCommissionBlock().should('contains.text', totalCommission);
      salesDetailPage.getTotalRefundedCommissionBlock().should('contains.text', totalRefundedCommission);
    }

    function assertCommissionTotalsInMerchantPortal(
      orderReference: string,
      totalCommission: string,
      totalRefundedCommission = '€0.00'
    ): void {
      salesOrdersPage.visit();
      salesOrdersPage.find({ query: orderReference }).click();

      salesOrdersPage.getTotalCommissionBlock().should('contains.text', totalCommission);
      salesOrdersPage.getTotalRefundedCommissionBlock().should('contains.text', totalRefundedCommission);
    }
  }
);
