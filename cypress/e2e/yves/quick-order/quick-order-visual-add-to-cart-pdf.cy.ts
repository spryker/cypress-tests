import { container } from '@utils';
import { QuickOrderPage } from '@pages/yves';
import { ConfigurationPage } from '@pages/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { QuickOrderVisualAddToCartDynamicFixtures, QuickOrderVisualAddToCartStaticFixtures } from '@interfaces/yves';

describe(
  'quick order visual add to cart PDF upload',
  {
    tags: ['@yves', '@quick-order', '@ai-commerce', 'ai-commerce'],
  },
  (): void => {
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because the visual add to cart settings are installed only in suite', (): void => {});

      return;
    }

    const quickOrderPage = container.get(QuickOrderPage);
    const configurationPage = container.get(ConfigurationPage);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: QuickOrderVisualAddToCartStaticFixtures;
    let dynamicFixtures: QuickOrderVisualAddToCartDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      configurationPage.requestSaveConfigurationValue({
        settingKey: staticFixtures.visualAddToCartEnabledSettingKey,
        value: staticFixtures.enabledSettingValue,
      });
      cy.runQueueWorker();

      customerLoginScenario.execute({
        email: dynamicFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });
    });

    after((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
      configurationPage.requestUseDefaultConfigurationValue(staticFixtures.visualAddToCartEnabledSettingKey);
      cy.runQueueWorker();
    });

    it('given visual add to cart is enabled when the buyer opens quick order then the upload accepts PDF files', (): void => {
      // Act
      quickOrderPage.visit();

      // Assert
      quickOrderPage
        .getVisualAddToCartFileInput()
        .should('have.attr', 'accept')
        .and('contain', staticFixtures.pdfMimeType);
      quickOrderPage.getVisualAddToCartDescription().should('contain.text', staticFixtures.pdfFormatName);
    });

    it('given a text file when the buyer uploads it then the invalid file type error is shown', (): void => {
      // Arrange
      quickOrderPage.visit();

      // Act
      quickOrderPage.uploadVisualAddToCartFile(staticFixtures.textOrderFile);

      // Assert
      quickOrderPage.getVisualAddToCartForm().should('contain.text', staticFixtures.invalidFileTypeMessage);
    });
  }
);
