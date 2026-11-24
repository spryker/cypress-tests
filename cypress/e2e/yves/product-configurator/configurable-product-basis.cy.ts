import { container } from '@utils';
import { ConfigurableProductBasisDynamicFixtures, ConfigurableProductBasisStaticFixtures } from '@interfaces/yves';
import { ProductManagementEditVariantPage } from '@pages/backoffice';
import { CartPage, CatalogPage, ProductConfiguratorPage, ProductPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';

const CONFIGURED_GROUP_NUMBER = 1;

const CHOSEN_OPTION_NUMBER = 2;

describe(
  'configurable product basis',
  {
    tags: ['@yves', 'configurable-product', 'product', 'cart', 'spryker-core', 'spryker-core-back-office'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because only the suite wires the configurable product configurator', () => {});

      return;
    }

    const productManagementEditVariantPage = container.get(ProductManagementEditVariantPage);
    const catalogPage = container.get(CatalogPage);
    const productPage = container.get(ProductPage);
    const productConfiguratorPage = container.get(ProductConfiguratorPage);
    const cartPage = container.get(CartPage);
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);

    let staticFixtures: ConfigurableProductBasisStaticFixtures;
    let dynamicFixtures: ConfigurableProductBasisDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    it('given a basis configuration saved in the back office when a customer configures the product then the chosen option reaches the cart', (): void => {
      // Arrange
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      productManagementEditVariantPage.visitVariant(
        dynamicFixtures.product.id_product_concrete,
        dynamicFixtures.product.fk_product_abstract
      );
      productManagementEditVariantPage.openConfiguratorSetupTab();
      productManagementEditVariantPage
        .downloadConfigurationTemplate(staticFixtures.configuratorKey)
        .then((template: string): void => {
          productManagementEditVariantPage.uploadConfigurationFile(template, staticFixtures.fileName);
          productManagementEditVariantPage.save();
        });
      productManagementEditVariantPage.getFlashMessage(staticFixtures.savedMessage).should('be.visible');
      cy.runQueueWorker();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
      catalogPage.visit();
      catalogPage.searchProductFromSuggestions({ query: dynamicFixtures.product.sku });
      productPage.reloadUntilConfigurable();

      // Act
      productPage.configure();
      productConfiguratorPage
        .getOptionTitle(CONFIGURED_GROUP_NUMBER, CHOSEN_OPTION_NUMBER)
        .should('equal', staticFixtures.chosenOptionTitle);
      productConfiguratorPage.chooseOption({
        groupNumber: CONFIGURED_GROUP_NUMBER,
        optionNumber: CHOSEN_OPTION_NUMBER,
      });

      // Assert
      productPage.getProductConfigurationStatus().should('contain', staticFixtures.configurationCompleteStatus);

      // Act
      productPage.addToCart();
      cartPage.visit();

      // Assert
      cartPage.getProductCartItems().should('contain', staticFixtures.chosenOptionTitle);
    });
  }
);
