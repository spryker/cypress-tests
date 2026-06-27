import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage } from '@pages/backoffice';
import { AiConfigurationDemoStaticFixtures } from '@interfaces/demo';

describe(
  'AI Configuration - Back Office AI Vendor & Assistant provider settings',
  {
    tags: ['@demo', '@ai-configuration', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const aiConfigurationPage = container.get(AiConfigurationPage);

    const AI_CONFIGURATION_KEY = 'ai_commerce:backoffice_assistant:ai_vendor:ai_configuration';
    const OPENAI_MODEL_KEY = 'ai_commerce:backoffice_assistant:ai_vendor:openai_model';
    const AWS_MODEL_KEY = 'ai_commerce:backoffice_assistant:ai_vendor:aws_model';
    const ANTHROPIC_MODEL_KEY = 'ai_commerce:backoffice_assistant:ai_vendor:anthropic_model';

    let staticFixtures: AiConfigurationDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('OpenAI AI Vendor tab opens (HTTP 200), lists the OpenAI, Anthropic and AWS vendor tabs, and shows a masked API token field and a model-prices JSON editor', (): void => {
      aiConfigurationPage.visitTab('ai_vendor', 'openai').its('response.statusCode').should('eq', 200);

      aiConfigurationPage.getCardTitle().should('contain.text', 'Configuration Management');
      aiConfigurationPage.getFeatureNav('ai_vendor').should('exist');
      aiConfigurationPage.getTabNav('ai_vendor', 'openai').should('exist');
      aiConfigurationPage.getTabNav('ai_vendor', 'anthropic').should('exist');
      aiConfigurationPage.getTabNav('ai_vendor', 'aws').should('exist');

      aiConfigurationPage
        .getSettingInput('ai_vendor:openai:general:api_token')
        .should('be.visible')
        .and('have.attr', 'type', 'password');
      aiConfigurationPage.getJsonEditor('ai_vendor:openai:general:model_prices').should('be.visible');
    });

    it('Anthropic AI Vendor tab opens (HTTP 200) and shows a masked API token field and a model-prices JSON editor', (): void => {
      aiConfigurationPage.visitTab('ai_vendor', 'anthropic').its('response.statusCode').should('eq', 200);

      aiConfigurationPage
        .getSettingInput('ai_vendor:anthropic:general:api_token')
        .should('be.visible')
        .and('have.attr', 'type', 'password');
      aiConfigurationPage.getJsonEditor('ai_vendor:anthropic:general:model_prices').should('be.visible');
    });

    it('AWS Bedrock AI Vendor tab opens (HTTP 200) and shows a masked token, the eu-central-1 region and a model-prices JSON editor', (): void => {
      aiConfigurationPage.visitTab('ai_vendor', 'aws').its('response.statusCode').should('eq', 200);

      aiConfigurationPage
        .getSettingInput('ai_vendor:aws:general:api_token')
        .should('be.visible')
        .and('have.attr', 'type', 'password');
      aiConfigurationPage
        .getSettingInput('ai_vendor:aws:general:region')
        .should('be.visible')
        .and('have.value', 'eu-central-1');
      aiConfigurationPage.getJsonEditor('ai_vendor:aws:general:model_prices').should('be.visible');
    });

    it('Backoffice Assistant provider radio offers three providers and pre-selects OpenAI by default', (): void => {
      aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant').its('response.statusCode').should('eq', 200);

      aiConfigurationPage.getRadioOptions(AI_CONFIGURATION_KEY).should('have.length', 3);
      aiConfigurationPage
        .getCheckedRadioOption(AI_CONFIGURATION_KEY)
        .should('have.value', 'AI_COMMERCE:AI_CONFIGURATION_BACKOFFICE_ASSISTANT_OPENAI');
    });

    it('shows only the model field for the selected provider — OpenAI model (gpt-4.1) visible, AWS and Anthropic model fields hidden', (): void => {
      aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');

      aiConfigurationPage.getSettingRow(OPENAI_MODEL_KEY).should('be.visible');
      aiConfigurationPage.getSettingInput(OPENAI_MODEL_KEY).should('have.value', 'gpt-4.1');
      aiConfigurationPage.getSettingRow(AWS_MODEL_KEY).should('not.be.visible');
      aiConfigurationPage.getSettingRow(ANTHROPIC_MODEL_KEY).should('not.be.visible');
    });
  }
);
