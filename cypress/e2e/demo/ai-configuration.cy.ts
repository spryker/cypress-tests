import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage } from '@pages/backoffice';
import { AiConfigurationDemoStaticFixtures } from '@interfaces/demo';

describe(
  'ai configuration',
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

    it('loads the OpenAI AI Vendor tab with HTTP 200 and renders its token + price fields', (): void => {
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

    it('renders the Anthropic AI Vendor tab with the API key field and price JSON editor', (): void => {
      aiConfigurationPage.visitTab('ai_vendor', 'anthropic').its('response.statusCode').should('eq', 200);

      aiConfigurationPage
        .getSettingInput('ai_vendor:anthropic:general:api_token')
        .should('be.visible')
        .and('have.attr', 'type', 'password');
      aiConfigurationPage.getJsonEditor('ai_vendor:anthropic:general:model_prices').should('be.visible');
    });

    it('renders the AWS Bedrock AI Vendor tab with token, region and price JSON editor', (): void => {
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

    it('renders the Backoffice Assistant AI Configuration radio with three providers, OpenAI preselected', (): void => {
      aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant').its('response.statusCode').should('eq', 200);

      aiConfigurationPage.getRadioOptions(AI_CONFIGURATION_KEY).should('have.length', 3);
      aiConfigurationPage
        .getCheckedRadioOption(AI_CONFIGURATION_KEY)
        .should('have.value', 'AI_COMMERCE:AI_CONFIGURATION_BACKOFFICE_ASSISTANT_OPENAI');
    });

    it('shows only the model field matching the selected provider (OpenAI default)', (): void => {
      aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');

      aiConfigurationPage.getSettingRow(OPENAI_MODEL_KEY).should('be.visible');
      aiConfigurationPage.getSettingInput(OPENAI_MODEL_KEY).should('have.value', 'gpt-4.1');
      aiConfigurationPage.getSettingRow(AWS_MODEL_KEY).should('not.be.visible');
      aiConfigurationPage.getSettingRow(ANTHROPIC_MODEL_KEY).should('not.be.visible');
    });
  }
);
