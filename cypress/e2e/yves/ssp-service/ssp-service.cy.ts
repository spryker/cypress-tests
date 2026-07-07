import { container } from '@utils';
import { retryableBefore } from '../../../support/e2e';
import { CustomerLoginScenario, CustomerLogoutScenario, CheckoutScenario } from '@scenarios/yves';
import { SspServiceListPage, CartPage, CatalogPage, ProductPage, CustomerOverviewPage } from '@pages/yves';

const assertServiceListPage = (page: SspServiceListPage): void => {
  const expectedHeaders = ['Order Reference', 'Service Name', 'Time and Date', 'Created At', 'State'];

  page.getPageTitle().should('contain', 'Services');
  page.getTable().should('exist');
  page.getTableHeaders().should('have.length.at.least', 5);

  expectedHeaders.forEach((header) => {
    page.getTableHeaders().contains(header).should('exist');
  });
};

const assertSorting = (page: SspServiceListPage, columnName: string, orderByValue: string): void => {
  page.clickSortColumn(columnName);
  page.getOrderByInput().should('have.value', orderByValue);
  page.getOrderDirectionInput().should('have.value', 'ASC');

  page.clickSortColumn(columnName);
  page.getOrderByInput().should('have.value', orderByValue);
  page.getOrderDirectionInput().should('have.value', 'DESC');
};

const assertSearchResult = (page: SspServiceListPage, searchQuery: string, expectedResultsCount: number): void => {
  page.getTableRows().should('be.visible');
  cy.url().should('include', searchQuery);
  page.getTableRows().should('have.length', expectedResultsCount);
};

const assertBusinessUnitSelectIsVisible = (page: SspServiceListPage): void => {
  page.getBusinessUnitSelect().should('exist');
  page.getBusinessUnitSelect().find('option[value*="company"]').should('exist');
};

const assertShipmentTypeGrouping = (page: CartPage): void => {
  page.getCartItemsListTitles().should('have.length.at.least', 2);
  page.getCartItemsListTitles().contains('Delivery');
  page.getCartItemsListTitles().contains('In-Center Service');
};

interface CustomerFixture {
  email: string;
  password?: string;
}

interface AddressFixture {
  id_customer_address: number;
}

interface ProductFixture {
  sku: string;
  name?: string;
}

interface ServicePointFixture {
  key: string;
  name: string;
}

interface ShipmentTypeFixture {
  key: string;
  name: string;
}

interface ServicePointAddressFixture {
  address1: string;
}

interface DynamicFixtures {
  customer: CustomerFixture;
  customer2: CustomerFixture;
  customer3: CustomerFixture;
  company1Customer: CustomerFixture;
  company2Customer: CustomerFixture;
  company3Customer: CustomerFixture;
  company4Customer: CustomerFixture;
  address1: AddressFixture;
  company1CustomerAddress: AddressFixture;
  company3CustomerAddress: AddressFixture;
  company4CustomerAddress: AddressFixture;
  product1: ProductFixture;
  servicePoint: ServicePointFixture;
  shipmentType2: ShipmentTypeFixture;
  servicePointAddress: ServicePointAddressFixture;
  [key: string]: unknown;
}

describe(
  'SSP Service Management',
  {
    tags: [
      '@yves',
      '@ssp-service',
      '@ssp',
      '@SspServiceManagement',
      'product',
      'shipment-service-points',
      'product-offer-service-points',
      'self-service-portal',
      'spryker-core',
    ],
  },
  (): void => {
    if (!['suite', 'b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because tests run only for suite and b2b-mp ', () => {});
      return;
    }
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const customerLogoutScenario = container.get(CustomerLogoutScenario);
    const sspServiceListPage = container.get(SspServiceListPage);
    const checkoutScenario = container.get(CheckoutScenario);
    const cartPage = container.get(CartPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerOverviewPage = container.get(CustomerOverviewPage);

    let staticFixtures: Record<string, unknown>;
    let dynamicFixtures: DynamicFixtures;
    let isSetupDone = false;

    retryableBefore((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    describe('Service List Page', () => {
      it('should verify all required table headers exist', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        assertServiceListPage(sspServiceListPage);
      });

      it('should sort table in both directions', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        assertSorting(sspServiceListPage, 'Order Reference', 'order_reference');
        assertSorting(sspServiceListPage, 'Service Name', 'product_name');
        assertSorting(sspServiceListPage, 'Created At', 'created_at');
      });

      it('should search services by SKU', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        const productSku = dynamicFixtures.product1.sku;

        if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
          sspServiceListPage.openFilter();
        }

        sspServiceListPage.searchFor('SKU', productSku);
        assertSearchResult(sspServiceListPage, productSku, 1);
      });
    });

    describe('Service rescheduling and cancellation', () => {
      isSetupDone = false;
      it('should allow rescheduling a service', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        sspServiceListPage.getTableRows().should('have.length.at.least', 2);

        sspServiceListPage.viewFirstServiceDetails();
        cy.url().should('include', '/order/details');

        sspServiceListPage.getDetailsPageRescheduleButton().should('be.visible').first().click();
        cy.url().should('include', '/update-service-time');

        const tomorrow = sspServiceListPage.updateServiceDateToTomorrow();

        cy.url().should('include', '/customer/ssp-service/list');
        sspServiceListPage
          .getTableRows()
          .first()
          .find('td')
          .eq(2)
          .invoke('text')
          .then((text) => {
            const updatedDate = text.trim();
            const day = tomorrow.getDate();
            const year = tomorrow.getFullYear();

            expect(updatedDate).to.include(`${day}, ${year}`);
          });
      });

      it('should allow cancelling a service', (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        sspServiceListPage.getTableRows().should('have.length', 2);

        sspServiceListPage.viewFirstServiceDetails();
        sspServiceListPage.getServiceCancelButton().should('be.visible').first().click();
        cy.url().should('include', '/customer/ssp-service/list');

        sspServiceListPage.viewFirstServiceDetails();
        sspServiceListPage.getServiceCancelButton().first().should('have.length', 1);
        sspServiceListPage.visit();
        sspServiceListPage.viewFirstServiceDetails();
        cy.url().should('include', '/order/details');
        sspServiceListPage.getServiceCancelButton().first().should('have.length', 1);
      });
    });

    describe('Service permissions control', () => {
      it("company users from different companies cannot see each other's services", (): void => {
        purchaseServiceAsCustomer(
          dynamicFixtures.company1Customer.email,
          dynamicFixtures.company1CustomerAddress.id_customer_address
        );

        assertServiceListPage(sspServiceListPage);
        sspServiceListPage.getTableRows().should('have.length.at.least', 1);

        if (['b2b-mp'].includes(Cypress.env('repositoryId'))) {
          sspServiceListPage.openFilter();
        }

        assertBusinessUnitSelectIsVisible(sspServiceListPage);

        customerLogoutScenario.execute();

        customerLoginScenario.execute({
          email: dynamicFixtures.company2Customer.email,
          password: staticFixtures.defaultPassword as string,
        });

        sspServiceListPage.visit();
        assertBusinessUnitSelectIsVisible(sspServiceListPage);
        sspServiceListPage.getTableRows().should('not.exist');
      });
    });

    describe('Service Point Cart and Checkout Flow', () => {
      it('should display service points per item in cart and group items by shipment type', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.company3Customer.email,
          password: staticFixtures.defaultPassword as string,
        });

        cartPage.visit();

        cartPage.assertServicePointsDisplayed();
        assertShipmentTypeGrouping(cartPage);

        purchaseServiceAsCustomer(
          dynamicFixtures.company3Customer.email,
          dynamicFixtures.company3CustomerAddress.id_customer_address,
          'in-center-service'
        );
      });

      it('should allow purchasing a product with a service point', (): void => {
        customerLoginScenario.execute({
          email: dynamicFixtures.company4Customer.email,
          password: staticFixtures.defaultPassword as string,
        });

        catalogPage.visit();
        catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product1.sku });

        productPage.selectShipmentType(dynamicFixtures.shipmentType2.name);
        productPage.selectServicePoint(dynamicFixtures.servicePoint.name);
        productPage.getSelectedServicePointName().should('contain', dynamicFixtures.servicePointAddress.address1);
        productPage.addToCart();

        cartPage.visit();

        cartPage.assertServicePointsDisplayed();
        assertShipmentTypeGrouping(cartPage);

        checkoutScenario.execute({
          idCustomerAddress: dynamicFixtures.company4CustomerAddress.id_customer_address,
          paymentMethod: 'dummyPaymentInvoice',
          shipmentType: 'in-center-service',
          isMultiShipment: true,
          skipServicePointAddressOverride: true,
        });

        customerOverviewPage.visit();
        customerOverviewPage.viewLastPlacedOrder();
      });
    });

    function purchaseServiceAsCustomer(email: string, idCustomerAddress: number, shipmentType?: string): void {
      customerLoginScenario.execute({
        email: email,
        password: staticFixtures.defaultPassword as string,
      });

      if (!isSetupDone) {
        checkoutScenario.execute({
          idCustomerAddress: idCustomerAddress,
          paymentMethod: 'dummyPaymentInvoice',
          shipmentType: shipmentType,
          isMultiShipment: true,
        });

        isSetupDone = true;
      }

      sspServiceListPage.visit();
    }
  }
);
