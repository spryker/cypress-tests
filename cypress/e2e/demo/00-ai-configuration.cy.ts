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

    const OPENAI_OPTION = 'AI_COMMERCE:AI_CONFIGURATION_BACKOFFICE_ASSISTANT_OPENAI';
    const AWS_OPTION = 'AI_COMMERCE:AI_CONFIGURATION_BACKOFFICE_ASSISTANT_AWS';

    const OPENAI_MODEL_DEFAULT = 'gpt-4.1';

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

    it(
      'OpenAI AI Vendor tab opens (HTTP 200), lists the OpenAI, Anthropic and AWS vendor tabs, and shows a masked API token field and a model-prices JSON editor',
      { tags: ['@demo-smoke'] },
      (): void => {
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
      }
    );

    it(
      'Anthropic AI Vendor tab opens (HTTP 200) and shows a masked API token field and a model-prices JSON editor',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiConfigurationPage.visitTab('ai_vendor', 'anthropic').its('response.statusCode').should('eq', 200);

        aiConfigurationPage
          .getSettingInput('ai_vendor:anthropic:general:api_token')
          .should('be.visible')
          .and('have.attr', 'type', 'password');
        aiConfigurationPage.getJsonEditor('ai_vendor:anthropic:general:model_prices').should('be.visible');
      }
    );

    it(
      'AWS Bedrock AI Vendor tab opens (HTTP 200) and shows a masked token, the eu-central-1 region and a model-prices JSON editor',
      { tags: ['@demo-smoke'] },
      (): void => {
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
      }
    );

    it(
      'masked OpenAI API token field accepts typed input and stays type=password without being saved',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiConfigurationPage.visitTab('ai_vendor', 'openai');

        aiConfigurationPage
          .getSettingInput('ai_vendor:openai:general:api_token')
          .should('be.visible')
          .and('have.attr', 'type', 'password')
          .type('dummy-local-not-a-real-token')
          .should('have.value', 'dummy-local-not-a-real-token')
          .and('have.attr', 'type', 'password');

        aiConfigurationPage.getSaveBar().should('be.visible');
        aiConfigurationPage.getChangesCount().should('have.text', '1');
      }
    );

    it(
      'Backoffice Assistant provider radio offers three providers and pre-selects OpenAI by default',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiConfigurationPage
          .visitTab('ai_commerce', 'backoffice_assistant')
          .its('response.statusCode')
          .should('eq', 200);

        aiConfigurationPage.getRadioOptions(AI_CONFIGURATION_KEY).should('have.length', 3);
        aiConfigurationPage.getCheckedRadioOption(AI_CONFIGURATION_KEY).should('have.value', OPENAI_OPTION);
      }
    );

    it(
      'shows only the model field for the selected provider — OpenAI model (gpt-4.1) visible, AWS and Anthropic model fields hidden',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');

        aiConfigurationPage.getSettingRow(OPENAI_MODEL_KEY).should('be.visible');
        aiConfigurationPage.getSettingInput(OPENAI_MODEL_KEY).should('have.value', OPENAI_MODEL_DEFAULT);
        aiConfigurationPage.getSettingRow(AWS_MODEL_KEY).should('not.be.visible');
        aiConfigurationPage.getSettingRow(ANTHROPIC_MODEL_KEY).should('not.be.visible');
      }
    );

    it(
      'selecting the AWS Bedrock provider radio hides the OpenAI model field and reveals the AWS Bedrock model field',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');

        aiConfigurationPage.getSettingRow(OPENAI_MODEL_KEY).should('be.visible');
        aiConfigurationPage.getSettingRow(AWS_MODEL_KEY).should('not.be.visible');

        aiConfigurationPage.selectRadioOption(AI_CONFIGURATION_KEY, AWS_OPTION);

        aiConfigurationPage.getCheckedRadioOption(AI_CONFIGURATION_KEY).should('have.value', AWS_OPTION);
        aiConfigurationPage.getSettingRow(AWS_MODEL_KEY).should('be.visible');
        aiConfigurationPage
          .getSettingInput(AWS_MODEL_KEY)
          .should('have.value', 'eu.anthropic.claude-sonnet-4-5-20250929-v1:0');
        aiConfigurationPage.getSettingRow(OPENAI_MODEL_KEY).should('not.be.visible');
        aiConfigurationPage.getSettingRow(ANTHROPIC_MODEL_KEY).should('not.be.visible');
      }
    );

    it(
      'changing the OpenAI model value shows the unsaved-changes bar, and Save persists the value across a reload',
      { tags: ['@demo-smoke'] },
      (): void => {
        const updatedModel = 'gpt-4.1-mini';

        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');
        aiConfigurationPage.getSaveBar().should('not.be.visible');

        aiConfigurationPage.setSettingInputValue(OPENAI_MODEL_KEY, updatedModel);
        aiConfigurationPage.getSaveBar().should('be.visible');
        aiConfigurationPage.getChangesCount().should('have.text', '1');

        aiConfigurationPage.getSaveButton().should('be.enabled');
        aiConfigurationPage.saveConfiguration();
        cy.wait('@saveConfiguration').then((interception) => {
          expect(interception.request.body.changes).to.be.an('array');
          const change = interception.request.body.changes.find(
            (entry: { key: string }) => entry.key === OPENAI_MODEL_KEY
          );
          expect(change).to.not.be.undefined;
          expect(change.value).to.eq(updatedModel);
          expect(interception.response?.body).to.have.property('success', true);
        });

        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');
        aiConfigurationPage.getSettingInput(OPENAI_MODEL_KEY).should('have.value', updatedModel);
        aiConfigurationPage.getSaveBar().should('not.be.visible');

        aiConfigurationPage.setSettingInputValue(OPENAI_MODEL_KEY, OPENAI_MODEL_DEFAULT);
        aiConfigurationPage.saveConfiguration();
        cy.wait('@saveConfiguration').its('response.body').should('have.property', 'success', true);

        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');
        aiConfigurationPage.getSettingInput(OPENAI_MODEL_KEY).should('have.value', OPENAI_MODEL_DEFAULT);
      }
    );
  }
);
