import { container } from '@utils';
import { AclDeniedPage, ProductManagementEditVariantPage } from '@pages/backoffice';
import {
  ProductConfiguratorSetupDynamicFixtures,
  ProductConfiguratorSetupProduct,
  ProductConfiguratorSetupStaticFixtures,
} from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

describe(
  'product configurator setup',
  { tags: ['@backoffice', '@configurable-product', 'configurable-product', 'product', 'spryker-core-back-office'] },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because only the suite wires the configurable product configurator', () => {});

      return;
    }

    const productManagementEditVariantPage = container.get(ProductManagementEditVariantPage);
    const aclDeniedPage = container.get(AclDeniedPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let dynamicFixtures: ProductConfiguratorSetupDynamicFixtures;
    let staticFixtures: ProductConfiguratorSetupStaticFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    const openConfiguratorSetup = (product: ProductConfiguratorSetupProduct): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      productManagementEditVariantPage.visitVariant(product.id_product_concrete, product.fk_product_abstract);
      productManagementEditVariantPage.openConfiguratorSetupTab();
    };

    const removeTemplatePrice = (template: string): string => {
      const basis = JSON.parse(template);
      const { groupIndex, optionIndex, currency } = staticFixtures.missingPrice;
      delete basis.groups[groupIndex].options[optionIndex].price[currency];

      return JSON.stringify(basis);
    };

    const uploadTemplate = (prepareTemplate: (template: string) => string): void => {
      productManagementEditVariantPage
        .downloadConfigurationTemplate(staticFixtures.configuratorKey)
        .then((template: string): void => {
          productManagementEditVariantPage.uploadConfigurationFile(prepareTemplate(template), staticFixtures.fileName);
          productManagementEditVariantPage.save();
        });
    };

    const getTexts = (elements: JQuery<HTMLElement>): string[] =>
      elements.toArray().map((element: HTMLElement): string => (element.textContent ?? '').trim());

    it('backoffice user sees an empty summary and the template of the configurator for a product without a saved configuration', (): void => {
      openConfiguratorSetup(dynamicFixtures.productWithoutConfiguration);

      productManagementEditVariantPage
        .getConfiguratorSetupStatus()
        .should('have.attr', 'data-status', staticFixtures.notSetUpStatus);
      productManagementEditVariantPage.getConfiguratorSetupEmptySummary().should('be.visible');
      productManagementEditVariantPage.getSavedConfigurationDownloadUnavailableButton().should('be.disabled');
      productManagementEditVariantPage
        .getConfigurationTemplateDownloadLink(staticFixtures.configuratorKey)
        .should('be.visible');
    });

    it('backoffice user saves the template of the configurator and sees its summary', (): void => {
      openConfiguratorSetup(dynamicFixtures.productForTemplate);

      uploadTemplate((template: string): string => template);

      productManagementEditVariantPage.getFlashMessage(staticFixtures.savedMessage).should('be.visible');
      productManagementEditVariantPage.openConfiguratorSetupTab();
      productManagementEditVariantPage
        .getConfiguratorSetupStatus()
        .should('have.attr', 'data-status', staticFixtures.setUpStatus);
      productManagementEditVariantPage
        .getConfiguratorSetupConfiguratorKey()
        .should('have.text', staticFixtures.configuratorKey);
      productManagementEditVariantPage.getConfiguratorSetupSummaryItems().should((items: JQuery<HTMLElement>): void => {
        expect(getTexts(items)).to.deep.equal(staticFixtures.templateSummaryItems);
      });
      productManagementEditVariantPage
        .getConfiguratorSetupLastChange()
        .invoke('text')
        .invoke('trim')
        .should('not.equal', staticFixtures.noLastChange);
    });

    it('backoffice user downloads the saved configuration', (): void => {
      openConfiguratorSetup(dynamicFixtures.productForDownload);

      productManagementEditVariantPage
        .downloadSavedConfiguration()
        .then((response: Cypress.Response<unknown>): void => {
          expect(response.headers['content-disposition']).to.contain(
            `${dynamicFixtures.productForDownload.sku}.${staticFixtures.configurationFileExtension}`
          );
          expect(response.body).to.deep.equal(
            JSON.parse(dynamicFixtures.productConfigurationForDownload.default_configuration)
          );
        });
    });

    it('backoffice user sees every error of an invalid configuration with its path, and nothing of the form is saved', (): void => {
      const product = dynamicFixtures.productForInvalidConfiguration;
      openConfiguratorSetup(product);

      productManagementEditVariantPage
        .getProductNameInput(staticFixtures.nameLocale)
        .invoke('val')
        .then((originalProductName): void => {
          productManagementEditVariantPage.changeProductName(
            staticFixtures.nameLocale,
            staticFixtures.changedProductName
          );
          uploadTemplate(removeTemplatePrice);

          productManagementEditVariantPage
            .getConfiguratorSetupErrors()
            .should('contain', staticFixtures.missingPriceError);
          productManagementEditVariantPage.getConfiguratorSetupNotSavedBadge().should('exist');
          productManagementEditVariantPage
            .getProductNameInput(staticFixtures.nameLocale)
            .should('have.value', staticFixtures.changedProductName);

          productManagementEditVariantPage.visitVariant(product.id_product_concrete, product.fk_product_abstract);
          productManagementEditVariantPage
            .getProductNameInput(staticFixtures.nameLocale)
            .should('have.value', String(originalProductName));
        });
    });

    it('backoffice user sees the values of a file that failed validation, while the last change of the saved configuration is kept', (): void => {
      openConfiguratorSetup(dynamicFixtures.productForFailedUpload);

      productManagementEditVariantPage.getConfiguratorSetupSummaryItems().should((items: JQuery<HTMLElement>): void => {
        expect(getTexts(items)).to.deep.equal(staticFixtures.savedConfigurationSummaryItems);
      });
      productManagementEditVariantPage
        .getConfiguratorSetupLastChange()
        .invoke('text')
        .invoke('trim')
        .then((savedLastChange: string): void => {
          expect(savedLastChange).not.to.equal(staticFixtures.noLastChange);

          uploadTemplate(removeTemplatePrice);

          productManagementEditVariantPage.getConfiguratorSetupNotSavedBadge().should('exist');
          productManagementEditVariantPage
            .getConfiguratorSetupSummaryItems()
            .should((items: JQuery<HTMLElement>): void => {
              expect(getTexts(items)).to.deep.equal(staticFixtures.templateSummaryItems);
            });
          productManagementEditVariantPage
            .getConfiguratorSetupLastChange()
            .invoke('text')
            .invoke('trim')
            .should('equal', savedLastChange);
        });
    });

    it('backoffice user cannot save a file that no configurator recognizes', (): void => {
      openConfiguratorSetup(dynamicFixtures.productForUnknownFormat);

      productManagementEditVariantPage.uploadConfigurationFile(
        staticFixtures.unknownFormatContent,
        staticFixtures.fileName
      );
      productManagementEditVariantPage.save();

      productManagementEditVariantPage
        .getConfiguratorSetupErrors()
        .should('contain', staticFixtures.configuratorNotFoundError);
    });

    it('backoffice user without access to the configurator setup gets the access denied page instead of its downloads', (): void => {
      const idProductConcrete = dynamicFixtures.productForAccessCheck.id_product_concrete;
      userLoginScenario.execute({
        username: dynamicFixtures.configuratorSetupDeniedUser.username,
        password: staticFixtures.defaultPassword,
      });

      productManagementEditVariantPage.visitConfigurationDownload(idProductConcrete);
      aclDeniedPage.getAccessDeniedTitle().should('have.text', staticFixtures.accessDeniedTitle);

      productManagementEditVariantPage.visitConfigurationTemplateDownload(
        idProductConcrete,
        staticFixtures.configuratorKey
      );
      aclDeniedPage.getAccessDeniedTitle().should('have.text', staticFixtures.accessDeniedTitle);
    });
  }
);
