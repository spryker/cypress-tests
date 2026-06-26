import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage } from '@pages/backoffice';
import { AiConfigurationDemoStaticFixtures } from '@interfaces/demo';

/**
 * Demo-only smoke coverage for the AI Commerce "AI Configuration" feature (Back Office).
 *
 * Surface: Back Office → Configuration Management (`/configuration/manage`). Two demo-only config
 * surfaces render here as left-nav entries selected via the `feature`/`tab` query params:
 *   - AI VENDOR (OpenAI / Anthropic / AWS Bedrock) — provider API-token + model-price fields.
 *   - AI COMMERCE → Backoffice Assistant — the AI Configuration provider radio with a conditional
 *     model field that follows the selected provider.
 *
 * Scope: confirm each tab loads (HTTP 200, no 500/crash) and renders its config components
 * (token inputs, JSON price editors, the provider radio + conditional model field). This guards the
 * upmerge regression class where a dropped demo-only config block or partial breaks the screen.
 *
 * NO AI provider interaction: no API token is ever entered, the Save Configuration action is never
 * clicked, and nothing is sent to OpenAI/AWS/Anthropic. Static fixtures only — presence/visibility/
 * interactivity, not provider behavior.
 *
 * This spec lives in the isolated `demo` group: run it with `npm run cy:demo`. It is excluded from
 * every other run (`cy:ci`, `cy:run`, `cy:smoke`, `cy:ci:ssp`) and has its own CI step.
 */
describe(
  'ai configuration',
  {
    tags: ['@demo', '@ai-configuration', 'spryker-core-back-office'],
  },
  (): void => {
    if (!['b2b-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the AI Configuration demo feature ships only in b2b-mp', () => {});
      return;
    }

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
