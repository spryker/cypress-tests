import { container } from '@utils';
import { BackInStockNotificationDynamicFixtures, BackInStockNotificationStaticFixtures } from '@interfaces/yves';
import { CatalogPage, ProductPage } from '@pages/yves';
import { CustomerLoginScenario } from '@scenarios/yves';

describe(
  'back in stock notification',
  { tags: ['@yves', 'availability-notification', 'availability', 'product', 'spryker-core'] },
  (): void => {
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: BackInStockNotificationStaticFixtures;
    let dynamicFixtures: BackInStockNotificationDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    const visitProductDetailPage = (sku: string): void => {
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: sku });
    };

    beforeEach((): void => {
      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    it('given a product with no stock left when its detail page is opened then it reads as out of stock and offers a back in stock notification', (): void => {
      // Act
      visitProductDetailPage(dynamicFixtures.outOfStockProduct.sku);

      // Assert
      productPage.getAvailabilityStatus().should('contain.text', staticFixtures.outOfStockLabel);
      productPage.getAvailabilityNotificationEmailField().should('be.visible');
    });

    it('given a product with no stock left when a back in stock notification is subscribed to and then cancelled then each step is confirmed', (): void => {
      // Arrange
      visitProductDetailPage(dynamicFixtures.outOfStockProduct.sku);

      // Act
      productPage.subscribeToAvailabilityNotification({ email: dynamicFixtures.customer.email });

      // Assert
      // The subscription is what turns the form into its opposite, so the unsubscribe form appearing
      // is the confirmation that it took effect rather than only that a message was rendered.
      productPage.getFlashMessages().should('contain.text', staticFixtures.subscribedMessage);
      productPage.getAvailabilityNotificationUnsubscribeForm().should('exist');

      // Act
      productPage.unsubscribeFromAvailabilityNotification();

      // Assert
      productPage.getFlashMessages().should('contain.text', staticFixtures.unsubscribedMessage);
      productPage.getAvailabilityNotificationEmailField().should('be.visible');
    });

    it('given a product that is in stock when its detail page is opened then no back in stock notification is offered', (): void => {
      // Act
      visitProductDetailPage(dynamicFixtures.inStockProduct.sku);

      // Assert
      productPage.getAvailabilityStatus().should('not.contain.text', staticFixtures.outOfStockLabel);
      productPage.getAvailabilityNotificationEmailField().should('not.exist');
      productPage.getAddToCartButton().should('be.enabled');
    });
  }
);
