import { container } from '@utils';
import { ProductManagementEditVariantPage } from '@pages/backoffice';
import {
  ProductConfiguratorSetupDynamicFixtures,
  ProductConfiguratorSetupStaticFixtures,
} from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product configurator setup',
  { tags: ['@backoffice', '@product-configuration', 'product-configuration', 'spryker-core-back-office'] },
  (): void => {
    // Only the suite wires the configurable product configurator of the date-time demo module.
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because only the suite wires the configurable product configurator', () => {});

      return;
    }

    const productManagementEditVariantPage = container.get(ProductManagementEditVariantPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let dynamicFixtures: ProductConfiguratorSetupDynamicFixtures;
    let staticFixtures: ProductConfiguratorSetupStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      productManagementEditVariantPage.visitVariant(
        dynamicFixtures.product.id_product_concrete,
        dynamicFixtures.product.fk_product_abstract
      );
      productManagementEditVariantPage.openConfiguratorSetupTab();
    });

    it('backoffice user saves the template of the configurator and sees its summary', (): void => {
      productManagementEditVariantPage
        .downloadConfigurationTemplate(staticFixtures.configuratorKey)
        .then((template: string): void => {
          productManagementEditVariantPage.uploadConfigurationFile(template, staticFixtures.fileName);
          productManagementEditVariantPage.save();

          productManagementEditVariantPage.getFlashMessage(staticFixtures.savedMessage).should('be.visible');

          productManagementEditVariantPage.openConfiguratorSetupTab();
          productManagementEditVariantPage
            .getConfiguratorSetupConfiguratorKey()
            .should('have.text', staticFixtures.configuratorKey);
        });
    });

    it('backoffice user sees every error of an invalid configuration with its path, and nothing of the form is saved', (): void => {
      productManagementEditVariantPage
        .getProductNameInput(staticFixtures.nameLocale)
        .invoke('val')
        .then((originalProductName): void => {
          productManagementEditVariantPage.changeProductName(
            staticFixtures.nameLocale,
            staticFixtures.changedProductName
          );

          productManagementEditVariantPage
            .downloadConfigurationTemplate(staticFixtures.configuratorKey)
            .then((template: string): void => {
              const basis = JSON.parse(template);
              delete basis.groups[2].options[0].price.CHF;

              productManagementEditVariantPage.uploadConfigurationFile(JSON.stringify(basis), staticFixtures.fileName);
              productManagementEditVariantPage.save();

              productManagementEditVariantPage
                .getConfiguratorSetupErrors()
                .should('contain', staticFixtures.missingCurrencyError);
              productManagementEditVariantPage.getConfiguratorSetupNotSavedBadge().should('exist');
              productManagementEditVariantPage
                .getProductNameInput(staticFixtures.nameLocale)
                .should('have.value', staticFixtures.changedProductName);

              productManagementEditVariantPage.visitVariant(
                dynamicFixtures.product.id_product_concrete,
                dynamicFixtures.product.fk_product_abstract
              );
              productManagementEditVariantPage
                .getProductNameInput(staticFixtures.nameLocale)
                .should('have.value', String(originalProductName));
            });
        });
    });

    it('backoffice user cannot save a file that no configurator recognizes', (): void => {
      productManagementEditVariantPage.uploadConfigurationFile(
        staticFixtures.unknownFormatContent,
        staticFixtures.fileName
      );
      productManagementEditVariantPage.save();

      productManagementEditVariantPage
        .getConfiguratorSetupErrors()
        .should('contain', staticFixtures.configuratorNotFoundError);
    });
  }
);
