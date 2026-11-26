import { container } from '@utils';
import { ProductManagementEditVariantPage } from '@pages/backoffice';
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

    const getLastChange = (): Cypress.Chainable<string> =>
      productManagementEditVariantPage.getConfiguratorSetupLastChange().invoke('text').invoke('trim');

    it('backoffice user saves the template of the configurator for a product without a saved configuration and sees its summary with its groups, options and rules', (): void => {
      openConfiguratorSetup(dynamicFixtures.productForTemplate);

      productManagementEditVariantPage
        .getConfiguratorSetupStatus()
        .should('have.attr', 'data-status', staticFixtures.notSetUpStatus);
      productManagementEditVariantPage.getConfiguratorSetupEmptySummary().should('be.visible');
      productManagementEditVariantPage.getSavedConfigurationDownloadUnavailableButton().should('be.disabled');
      productManagementEditVariantPage
        .getConfigurationTemplateDownloadLink(staticFixtures.configuratorKey)
        .should('be.visible');

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
      getLastChange().should('not.equal', staticFixtures.noLastChange);

      productManagementEditVariantPage.openConfigurableProductSummarySections();

      productManagementEditVariantPage.getConfigurableProductSummaryGroupLabels().first().should('be.visible');
      productManagementEditVariantPage
        .getConfigurableProductSummaryGroupLabels()
        .should((labels: JQuery<HTMLElement>): void => {
          expect(getTexts(labels)).to.deep.equal(staticFixtures.templateGroupLabels);
        });
      productManagementEditVariantPage
        .getConfigurableProductSummaryRuleTexts()
        .should('have.length', staticFixtures.templateRuleCount)
        .first()
        .should('be.visible')
        .and('have.text', staticFixtures.templateFirstRuleText);
    });

    it('backoffice user downloads the saved configuration and the template of the configurator as files of the configurator format', (): void => {
      openConfiguratorSetup(dynamicFixtures.productForDownload);
      const fileName = `${dynamicFixtures.productForDownload.sku}.${staticFixtures.configurationFileExtension}`;

      productManagementEditVariantPage
        .downloadSavedConfiguration()
        .then((response: Cypress.Response<unknown>): void => {
          expect(response.headers['content-disposition']).to.contain(fileName);
          expect(response.headers['content-type']).to.contain(staticFixtures.configurationFileContentType);
          expect(response.body).to.deep.equal(
            JSON.parse(dynamicFixtures.productConfigurationForDownload.default_configuration)
          );
        });
      productManagementEditVariantPage
        .requestConfigurationTemplateDownload(staticFixtures.configuratorKey)
        .then((response: Cypress.Response<unknown>): void => {
          expect(response.headers['content-disposition']).to.contain(fileName);
          expect(response.headers['content-type']).to.contain(staticFixtures.configurationFileContentType);
          expect(response.body).to.have.property('schemaVersion', staticFixtures.templateSchemaVersion);
          expect(response.body).to.have.property('groups').with.lengthOf(staticFixtures.templateGroupLabels.length);
        });
    });

    it('backoffice user sees every error and the values of an invalid configuration, while neither the configuration nor the rest of the form is saved', (): void => {
      const product = dynamicFixtures.productForFailedUpload;
      openConfiguratorSetup(product);

      productManagementEditVariantPage.getConfiguratorSetupSummaryItems().should((items: JQuery<HTMLElement>): void => {
        expect(getTexts(items)).to.deep.equal(staticFixtures.savedConfigurationSummaryItems);
      });
      getLastChange()
        .should('not.equal', staticFixtures.noLastChange)
        .then((savedLastChange: string): void => {
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
                .getConfiguratorSetupSummaryItems()
                .should((items: JQuery<HTMLElement>): void => {
                  expect(getTexts(items)).to.deep.equal(staticFixtures.templateSummaryItems);
                });
              getLastChange().should('equal', savedLastChange);
              productManagementEditVariantPage
                .getProductNameInput(staticFixtures.nameLocale)
                .should('have.value', staticFixtures.changedProductName);

              productManagementEditVariantPage.visitVariant(product.id_product_concrete, product.fk_product_abstract);
              productManagementEditVariantPage
                .getProductNameInput(staticFixtures.nameLocale)
                .should('have.value', String(originalProductName));
              productManagementEditVariantPage.openConfiguratorSetupTab();
              productManagementEditVariantPage
                .getConfiguratorSetupSummaryItems()
                .should((items: JQuery<HTMLElement>): void => {
                  expect(getTexts(items)).to.deep.equal(staticFixtures.savedConfigurationSummaryItems);
                });
            });
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
  }
);
