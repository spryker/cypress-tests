import { container, skipUnlessAiProviderEnabled } from '@utils';
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
    const OPENAI_MODEL_UPDATED = 'gpt-4.1-mini';
    const AWS_MODEL_DEFAULT = 'eu.anthropic.claude-sonnet-4-5-20250929-v1:0';
    const AWS_REGION_DEFAULT = 'eu-central-1';

    type VendorTab = {
      vendor: string;
      extraFields?: Array<{ field: string; value: string }>;
    };

    const VENDOR_TABS: VendorTab[] = [
      { vendor: 'openai' },
      { vendor: 'aws', extraFields: [{ field: 'region', value: AWS_REGION_DEFAULT }] },
    ];

    type PromptField = {
      key: string;
      label: string;
      placeholders: string[];
    };

    const PROMPT_TABS: Array<{ tab: string; fields: PromptField[] }> = [
      {
        tab: 'quick_order',
        fields: [
          {
            key: 'ai_commerce:quick_order:system_prompts:image_recognition_prompt',
            label: 'Image Recognition Prompt',
            placeholders: ['%s'],
          },
        ],
      },
      {
        tab: 'search_by_image',
        fields: [
          {
            key: 'ai_commerce:search_by_image:system_prompts:search_term_prompt',
            label: 'Search Term Prompt',
            placeholders: [],
          },
        ],
      },
      {
        tab: 'smart_pim',
        fields: [
          {
            key: 'ai_commerce:smart_pim:system_prompts:content_improver_prompt',
            label: 'Content Improver Prompt',
            placeholders: ['%s'],
          },
          {
            key: 'ai_commerce:smart_pim:system_prompts:translation_prompt',
            label: 'Translation Prompt',
            placeholders: ['%s'],
          },
          {
            key: 'ai_commerce:smart_pim:system_prompts:translation_collection_prompt',
            label: 'Translation Collection Prompt',
            placeholders: ['%s'],
          },
          {
            key: 'ai_commerce:smart_pim:system_prompts:category_suggestion_prompt',
            label: 'Category Suggestion Prompt',
            placeholders: ['%s'],
          },
          {
            key: 'ai_commerce:smart_pim:system_prompts:image_alt_text_prompt',
            label: 'Image Alt Text Prompt',
            placeholders: ['%s'],
          },
        ],
      },
    ];

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

    it('AI Vendor feature lists the OpenAI, Anthropic and AWS tabs', { tags: ['@demo-smoke'] }, (): void => {
      aiConfigurationPage.visitTab('ai_vendor', 'openai').its('response.statusCode').should('eq', 200);

      aiConfigurationPage.getCardTitle().should('contain.text', aiConfigurationPage.getCardTitleText());
      aiConfigurationPage.getFeatureNav('ai_vendor').should('exist');

      VENDOR_TABS.forEach(({ vendor }) => {
        aiConfigurationPage.getTabNav('ai_vendor', vendor).should('exist');
      });
    });

    VENDOR_TABS.forEach(({ vendor, extraFields = [] }) => {
      it(
        `${vendor} AI Vendor tab returns HTTP 200 and shows a masked API token field and a model-prices JSON editor`,
        { tags: ['@demo-smoke'] },
        (): void => {
          aiConfigurationPage.visitTab('ai_vendor', vendor).its('response.statusCode').should('eq', 200);

          aiConfigurationPage.getApiTokenSettingInput(vendor).should('be.visible').and('have.attr', 'type', 'password');
          aiConfigurationPage.getModelPricesEditor(vendor).should('be.visible');

          extraFields.forEach(({ field, value }) => {
            aiConfigurationPage
              .getSettingInput(aiConfigurationPage.getVendorSettingKey(vendor, field))
              .should('be.visible')
              .and('have.value', value);
          });
        }
      );
    });

    it(
      'the masked OpenAI API token field stays type=password: a preset token is kept, otherwise typed input raises the save bar',
      { tags: ['@demo-smoke'] },
      (): void => {
        const dummyToken = 'dummy-local-not-a-real-token';

        aiConfigurationPage.visitTab('ai_vendor', 'openai');

        aiConfigurationPage
          .getApiTokenSettingInput('openai')
          .should('be.visible')
          .and('have.attr', 'type', 'password')
          .then(($input) => {
            const presetToken = String($input.val() ?? '');

            if (presetToken.trim()) {
              cy.wrap($input).should('have.attr', 'type', 'password').and('have.value', presetToken);
              expect(
                presetToken.trim().length,
                'preset OpenAI API token must not be trivially short'
              ).to.be.greaterThan(0);

              return;
            }

            cy.wrap($input).type(dummyToken);
            aiConfigurationPage
              .getApiTokenSettingInput('openai')
              .should('have.value', dummyToken)
              .and('have.attr', 'type', 'password');

            aiConfigurationPage.getSaveBar().should('have.css', 'display', 'block');
            aiConfigurationPage.getChangesCount().should('have.text', '1');
          });
      }
    );

    it(
      'Backoffice Assistant provider radio offers three options and pre-selects OpenAI by default',
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
      'with OpenAI selected, only the OpenAI model field (gpt-4.1) is visible and the AWS and Anthropic model fields are hidden',
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
        aiConfigurationPage.getSettingInput(AWS_MODEL_KEY).should('have.value', AWS_MODEL_DEFAULT);
        aiConfigurationPage.getSettingRow(OPENAI_MODEL_KEY).should('not.be.visible');
        aiConfigurationPage.getSettingRow(ANTHROPIC_MODEL_KEY).should('not.be.visible');
      }
    );

    it(
      'changing the OpenAI model value shows the unsaved-changes bar, and Save persists the value across a reload',
      { tags: ['@demo-smoke'] },
      (): void => {
        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');
        aiConfigurationPage.getSaveBar().should('have.css', 'display', 'none');

        aiConfigurationPage.setSettingInputValue(OPENAI_MODEL_KEY, OPENAI_MODEL_UPDATED);
        aiConfigurationPage.getSaveBar().should('have.css', 'display', 'block');
        aiConfigurationPage.getChangesCount().should('have.text', '1');

        aiConfigurationPage.getSaveButton().should('be.enabled');
        aiConfigurationPage.saveConfiguration();
        cy.wait('@saveConfiguration').then((interception) => {
          expect(interception.request.body.changes).to.be.an('array');
          const change = interception.request.body.changes.find(
            (entry: { key: string }) => entry.key === OPENAI_MODEL_KEY
          );
          expect(change).to.not.be.undefined;
          expect(change.value).to.eq(OPENAI_MODEL_UPDATED);
          expect(interception.response?.body).to.have.property('success', true);
        });

        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');
        aiConfigurationPage.getSettingInput(OPENAI_MODEL_KEY).should('have.value', OPENAI_MODEL_UPDATED);
        aiConfigurationPage.getSaveBar().should('have.css', 'display', 'none');

        aiConfigurationPage.setSettingInputValue(OPENAI_MODEL_KEY, OPENAI_MODEL_DEFAULT);
        aiConfigurationPage.saveConfiguration();
        cy.wait('@saveConfiguration').its('response.body').should('have.property', 'success', true);

        aiConfigurationPage.visitTab('ai_commerce', 'backoffice_assistant');
        aiConfigurationPage.getSettingInput(OPENAI_MODEL_KEY).should('have.value', OPENAI_MODEL_DEFAULT);
      }
    );

    PROMPT_TABS.forEach(({ tab, fields }) => {
      it(
        `${tab} tab returns HTTP 200 and renders its System Prompts textarea(s) with the non-empty shipped default(s)`,
        { tags: ['@demo-smoke'] },
        (): void => {
          aiConfigurationPage.visitTab('ai_commerce', tab).its('response.statusCode').should('eq', 200);

          aiConfigurationPage.getSettingRows('system_prompts').should('have.length', fields.length);

          fields.forEach((field) => {
            aiConfigurationPage.getSettingRow(field.key).should('be.visible');
            aiConfigurationPage
              .getSettingInput(field.key)
              .should('be.visible')
              .and(($textarea) => {
                expect($textarea.prop('tagName'), `${field.label} must render as a textarea`).to.eq('TEXTAREA');
                expect(
                  String($textarea.val() ?? '').trim().length,
                  `${field.label} default prompt must not be empty`
                ).to.be.greaterThan(0);
              });
          });
        }
      );
    });

    it(
      'shipped default prompts keep their dynamic placeholders so runtime substitution stays intact',
      { tags: ['@demo-smoke'] },
      (): void => {
        PROMPT_TABS.filter(({ fields }) => fields.some((field) => field.placeholders.length > 0)).forEach(
          ({ tab, fields }) => {
            aiConfigurationPage.visitTab('ai_commerce', tab);

            fields
              .filter((field) => field.placeholders.length > 0)
              .forEach((field) => {
                aiConfigurationPage.getSettingInput(field.key).then(($textarea) => {
                  const value = String($textarea.val() ?? '');
                  field.placeholders.forEach((placeholder) => {
                    expect(value, `${field.label} must retain the ${placeholder} placeholder`).to.contain(placeholder);
                  });
                });
              });
          }
        );
      }
    );

    it(
      'editing a Smart PIM prompt raises the unsaved-changes bar and persists the override across a reload before restoring the default',
      { tags: ['@demo-smoke'] },
      (): void => {
        const promptKey = 'ai_commerce:smart_pim:system_prompts:content_improver_prompt';
        const overridePrompt = 'CC-38802 override: improve this product copy. Text to improve: %s';

        aiConfigurationPage.visitTab('ai_commerce', 'smart_pim');
        aiConfigurationPage.getSaveBar().should('have.css', 'display', 'none');

        aiConfigurationPage
          .getSettingInput(promptKey)
          .invoke('val')
          .then((defaultValue) => {
            const originalPrompt = String(defaultValue ?? '');
            expect(originalPrompt.trim().length, 'default prompt must exist before overriding').to.be.greaterThan(0);

            aiConfigurationPage.setSettingInputValue(promptKey, overridePrompt);
            aiConfigurationPage.getSaveBar().should('have.css', 'display', 'block');
            aiConfigurationPage.getChangesCount().should('have.text', '1');

            aiConfigurationPage.getSaveButton().should('be.enabled');
            aiConfigurationPage.saveConfiguration();
            cy.wait('@saveConfiguration').then((interception) => {
              const change = interception.request.body.changes.find(
                (entry: { key: string }) => entry.key === promptKey
              );
              expect(change, 'the prompt override must be part of the save payload').to.not.be.undefined;
              expect(change.value).to.eq(overridePrompt);
              expect(interception.response?.body).to.have.property('success', true);
            });

            aiConfigurationPage.visitTab('ai_commerce', 'smart_pim');
            aiConfigurationPage.getSettingInput(promptKey).should('have.value', overridePrompt);
            aiConfigurationPage.getSaveBar().should('have.css', 'display', 'none');

            aiConfigurationPage.setSettingInputValue(promptKey, originalPrompt);
            aiConfigurationPage.saveConfiguration();
            cy.wait('@saveConfiguration').its('response.body').should('have.property', 'success', true);

            aiConfigurationPage.visitTab('ai_commerce', 'smart_pim');
            aiConfigurationPage.getSettingInput(promptKey).should('have.value', originalPrompt);
          });
      }
    );

    it(
      'the OpenAI, Anthropic and AWS Bedrock API tokens are all configured (real provider keys present for a full run)',
      { tags: ['@demo-full'] },
      function (): void {
        skipUnlessAiProviderEnabled(this);

        VENDOR_TABS.forEach(({ vendor }) => {
          aiConfigurationPage.visitTab('ai_vendor', vendor).its('response.statusCode').should('eq', 200);
          aiConfigurationPage
            .getApiTokenSettingInput(vendor)
            .should('be.visible')
            .and('have.attr', 'type', 'password')
            .then(($input) => {
              const token = String($input.val() ?? '').trim();
              expect(token.length, `${vendor} API token must be set for a full run`).to.be.greaterThan(0);
            });
        });

        aiConfigurationPage.getSettingInput(aiConfigurationPage.getVendorSettingKey('aws', 'region')).then(($input) => {
          const region = String($input.val() ?? '').trim();
          expect(region.length, 'AWS Bedrock region must be set for a full run').to.be.greaterThan(0);
        });
      }
    );
  }
);
