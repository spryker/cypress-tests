import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ConfigurationPage } from '@pages/backoffice';
import {
  ConfigurationAiModelSelectionDynamicFixtures,
  ConfigurationAiModelSelectionStaticFixtures,
} from '@interfaces/backoffice';

describe(
  'Configuration - AI model selection',
  {
    tags: ['@backoffice', '@configuration', 'configuration', 'spryker-core-back-office'],
  },
  (): void => {
    // The AI vendor model settings are defined only in the suite project configuration.
    if (Cypress.env('repositoryId') !== 'suite') {
      it.skip('skipped because only the suite defines the AI vendor model settings', () => {});

      return;
    }

    const configurationPage = container.get(ConfigurationPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ConfigurationAiModelSelectionStaticFixtures;
    let dynamicFixtures: ConfigurationAiModelSelectionDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    afterEach((): void => {
      configurationPage.requestUseDefaultConfigurationValue(staticFixtures.storefrontAssistant.openAiModelSettingKey);
    });

    it('offers only the supported models and persists the selected model', (): void => {
      const { storefrontAssistant } = staticFixtures;

      configurationPage.visitAiCommerceTab(storefrontAssistant.tabKey);
      configurationPage.selectRadioOption(storefrontAssistant.vendorSettingKey, storefrontAssistant.openAiVendor);

      configurationPage
        .getSelectableOptions(storefrontAssistant.openAiModelSettingKey)
        .then((options: JQuery<HTMLOptionElement>): void => {
          expect(options.toArray().map((option: HTMLOptionElement): string => option.value)).to.deep.equal(
            storefrontAssistant.supportedModels
          );
        });

      configurationPage.selectOption(storefrontAssistant.openAiModelSettingKey, storefrontAssistant.alternativeModel);
      configurationPage.saveConfigurationAndWaitForResponse();

      configurationPage.visitAiCommerceTab(storefrontAssistant.tabKey);
      configurationPage
        .getSelectSetting(storefrontAssistant.openAiModelSettingKey)
        .should('have.value', storefrontAssistant.alternativeModel);
    });

    it('rejects a model that is not in the supported list', (): void => {
      const { storefrontAssistant } = staticFixtures;

      configurationPage
        .requestSaveConfigurationValue({
          settingKey: storefrontAssistant.openAiModelSettingKey,
          value: storefrontAssistant.unsupportedModel,
        })
        .then((response): void => {
          expect(response.body.success).to.equal(false);
          expect(response.body.errors[storefrontAssistant.openAiModelSettingKey]).to.contain(
            storefrontAssistant.unsupportedModel
          );
        });
    });
  }
);
