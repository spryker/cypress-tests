import { container, skipUnlessAiProviderEnabled } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage, AuditLogsPage, SmartCmsPage } from '@pages/backoffice';
import { SmartCmsDemoStaticFixtures } from '@interfaces/demo';

describe(
  'Smart CMS - Back Office CMS content assistant panel',
  {
    tags: ['@demo', '@smart-cms', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const smartCmsPage = container.get(SmartCmsPage);
    const aiConfigurationPage = container.get(AiConfigurationPage);
    const auditLogsPage = container.get(AuditLogsPage);

    const REAL_FLOW_TIMEOUT = 15000;
    const AWS_GENERATE_ATTEMPT_TIMEOUT_MS = 45000;
    const AWS_GENERATE_MAX_ATTEMPTS = 3;

    const restoreSmartCmsOpenAiVendor = (): Cypress.Chainable =>
      aiConfigurationPage.setFeatureVendor('smart_cms', 'openai');

    type GenerateInterception = { response?: { statusCode?: number } };

    const isSuccessfulInterception = (interception: GenerateInterception): boolean =>
      (interception.response?.statusCode ?? 0) >= 200 && (interception.response?.statusCode ?? 0) <= 299;

    const isSettledInterception = (interception: GenerateInterception): boolean => interception.response !== undefined;

    const findSettledInterceptionForClick = (
      allInterceptions: Array<GenerateInterception>,
      requestCountBeforeClick: number
    ): GenerateInterception | undefined => allInterceptions.slice(requestCountBeforeClick).find(isSettledInterception);

    const clickAskAiAndAwaitRealGenerate = (attemptsLeft = AWS_GENERATE_MAX_ATTEMPTS): void => {
      cy.get('@generateRequest.all').then((before: unknown): void => {
        const requestCountBeforeClick = (before as Array<GenerateInterception>).length;

        smartCmsPage.clickAskAi();

        cy.get('@generateRequest.all', { timeout: AWS_GENERATE_ATTEMPT_TIMEOUT_MS })
          .should((interceptions: unknown): void => {
            const settled = findSettledInterceptionForClick(
              interceptions as Array<GenerateInterception>,
              requestCountBeforeClick
            );

            expect(settled, 'the request triggered by this click has a settled response').to.not.be.undefined;
          })
          .then((interceptions: unknown): void => {
            const settled = findSettledInterceptionForClick(
              interceptions as Array<GenerateInterception>,
              requestCountBeforeClick
            ) as GenerateInterception;

            if (isSuccessfulInterception(settled)) {
              return;
            }

            if (attemptsLeft <= 1) {
              expect(
                settled.response?.statusCode ?? 0,
                `generate responded 2xx within ${AWS_GENERATE_MAX_ATTEMPTS} attempts`
              ).to.be.within(200, 299);

              return;
            }

            smartCmsPage.getPanelAsk().should('not.be.disabled');
            clickAskAiAndAwaitRealGenerate(attemptsLeft - 1);
          });
      });
    };

    let staticFixtures: SmartCmsDemoStaticFixtures;

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      smartCmsPage.enableSmartCms();
    });

    after((): void => {
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      smartCmsPage.enableSmartCms();
    });

    it(
      'renders the Smart CMS panel on the Page editor, reveals its controls when expanded, and exposes its inline config on the Block editor',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor().its('response.statusCode').should('eq', 200);

        smartCmsPage.getPanel().should('be.visible');
        smartCmsPage.getPanelToggle().should('be.visible').and('contain.text', smartCmsPage.getPanelToggleTitle());

        smartCmsPage.getPanelInput().should('exist');
        smartCmsPage.getPanelAsk().should('exist');
        smartCmsPage.getPanelAttach().should('exist');

        smartCmsPage.getPanelToggle().click();

        smartCmsPage
          .getPanelInput()
          .should('be.visible')
          .and('have.attr', 'placeholder', smartCmsPage.getPanelInputPlaceholder());
        smartCmsPage.getPanelAsk().should('be.visible').and('contain.text', smartCmsPage.getPanelAskLabel());
        smartCmsPage.getPanelAttach().should('be.visible');

        smartCmsPage.visitCmsBlockEditor().its('response.statusCode').should('eq', 200);
        smartCmsPage.getPanel().should('be.visible');
        cy.window().its(smartCmsPage.getContentConfigWindowKey()).should('be.an', 'object');
      }
    );

    it('accepts typed text in the prompt input once the panel is expanded', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.visitCmsPageEditor();
      smartCmsPage.expandPanel();

      smartCmsPage.typePrompt('Write a punchy hero title for this landing page');
    });

    it(
      'lists an attached file by its name and clears it via its remove control',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();

        smartCmsPage.attachFile(staticFixtures.probeImagePath);
        smartCmsPage
          .getPanelAttachmentName()
          .should('have.length', 1)
          .and('contain.text', smartCmsPage.getProbeImageFileName());

        smartCmsPage.removeFirstAttachment();
        smartCmsPage.getPanelAttachmentName().should('have.length', 0);
      }
    );

    it(
      'sends the typed prompt in the generate POST and surfaces an error when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();
        smartCmsPage.interceptGenerateWithProviderFailure();

        const prompt = 'Write a punchy hero title for this landing page';
        smartCmsPage.typePrompt(prompt);
        smartCmsPage.clickAskAi();

        cy.wait('@generateRequest').then((interception): void => {
          expect(interception.request.method).to.eq('POST');

          const body = interception.request.body;
          const payload = typeof body === 'string' ? JSON.parse(body) : body;

          expect(payload).to.have.property('userPrompt', prompt);
          expect(payload).to.have.property('entityType', staticFixtures.cmsPageEntityType);
          expect(payload).to.have.property('idEntity', staticFixtures.cmsPageIdEntity);
          expect(payload).to.have.property('_token').that.is.a('string').and.not.empty;
          expect(payload).to.have.property('placeholders');
        });

        smartCmsPage.getPanelMessage().should('have.class', smartCmsPage.getPanelMessageErrorClass()).and('be.visible');
        smartCmsPage.getPanelAsk().should('be.visible').and('not.be.disabled');
      }
    );

    it('includes the attached file in the generate POST payload', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.visitCmsPageEditor();
      smartCmsPage.expandPanel();
      smartCmsPage.interceptGenerateWithProviderFailure();

      smartCmsPage.attachFile(staticFixtures.probeImagePath);
      smartCmsPage.getPanelAttachmentName().should('have.length', 1);

      smartCmsPage.typePrompt('Suggest alt text based on the attached image');
      smartCmsPage.clickAskAi();

      cy.wait('@generateRequest').then((interception): void => {
        const body = interception.request.body;
        const payload = typeof body === 'string' ? JSON.parse(body) : body;

        expect(payload.attachments).to.be.an('array').with.length(1);
        expect(payload.attachments[0]).to.have.property('mediaType', staticFixtures.probeImageMediaType);
        expect(payload.attachments[0]).to.have.property('content').that.is.a('string').and.not.empty;
      });

      smartCmsPage.getPanelMessage().should('be.visible');
    });

    it(
      'guards the generate endpoint: GET, token-less POST, invalid CSRF token and (feature off) all rejected',
      { tags: ['@demo-smoke'] },
      (): void => {
        const guardContracts: Array<{
          description: string;
          options: { method?: string; body?: Record<string, unknown> };
          expectedStatus: number;
          expectedErrorKey?: string;
          disableFeature?: boolean;
        }> = [
          { description: 'GET is rejected', options: { method: 'GET' }, expectedStatus: 403 },
          { description: 'token-less POST is rejected', options: { method: 'POST', body: {} }, expectedStatus: 403 },
          {
            description: 'invalid CSRF token is rejected with the invalid-csrf error key',
            options: { method: 'POST', body: { _token: 'not-a-valid-token', userPrompt: 'x' } },
            expectedStatus: 403,
            expectedErrorKey: staticFixtures.invalidCsrfErrorKey,
          },
          {
            description: 'when disabled, the disabled error key is returned ahead of the CSRF check',
            options: { method: 'POST', body: { _token: 'not-a-valid-token' } },
            expectedStatus: 403,
            expectedErrorKey: staticFixtures.disabledErrorKey,
            disableFeature: true,
          },
        ];

        cy.wrap(guardContracts).each((contract: (typeof guardContracts)[number]): void => {
          if (contract.disableFeature) {
            smartCmsPage.disableSmartCms();
          }

          smartCmsPage.requestGenerate(staticFixtures.generateEndpointPath, contract.options).then((response): void => {
            expect(response.status, contract.description).to.eq(contract.expectedStatus);
            if (contract.expectedErrorKey) {
              expect(response.body).to.have.property('error', contract.expectedErrorKey);
            }
          });

          if (contract.disableFeature) {
            smartCmsPage.enableSmartCms();
          }
        });
      }
    );

    it(
      'rejects an unsupported attachment media type with 422 and a structured error',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();

        smartCmsPage.getInjectedCsrfToken().then((token): void => {
          expect(token, 'editor injected a CSRF token').to.be.a('string').and.not.empty;

          smartCmsPage
            .requestGenerate(staticFixtures.generateEndpointPath, {
              method: 'POST',
              body: {
                _token: token,
                userPrompt: 'x',
                attachments: [{ mediaType: staticFixtures.unsupportedAttachmentMediaType, content: 'QUJD' }],
              },
            })
            .then((response): void => {
              expect(response.status).to.eq(422);
              expect(response.body.error).to.be.an('array').with.length.of.at.least(1);
              expect((response.body.error as Array<{ message: string }>)[0]).to.have.property(
                'message',
                staticFixtures.unsupportedAttachmentError
              );
            });
        });
      }
    );

    it(
      'expands then collapses the panel, updating the collapsed class and aria-expanded',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();

        smartCmsPage.getPanel().should('have.class', smartCmsPage.getPanelCollapsedClass());
        smartCmsPage.getPanelToggle().should('have.attr', 'aria-expanded', 'false');

        smartCmsPage.getPanelToggle().click();
        smartCmsPage.getPanel().should('not.have.class', smartCmsPage.getPanelCollapsedClass());
        smartCmsPage.getPanelToggle().should('have.attr', 'aria-expanded', 'true');
        smartCmsPage.getPanelInput().should('be.visible');

        smartCmsPage.getPanelToggle().click();
        smartCmsPage.getPanel().should('have.class', smartCmsPage.getPanelCollapsedClass());
        smartCmsPage.getPanelToggle().should('have.attr', 'aria-expanded', 'false');
      }
    );

    it(
      'issues no generate request when Ask AI is clicked with an empty prompt',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();
        smartCmsPage.interceptGenerateWithProviderFailure();

        smartCmsPage.getPanelInput().clear();
        smartCmsPage.clickAskAi();

        cy.get('@generateRequest.all').should('have.length', 0);
        smartCmsPage.getPanelMessage().should('not.have.class', smartCmsPage.getPanelMessageVisibleClass());
      }
    );

    it(
      'rejects an unsupported file type client-side with an error and does not list it as an attachment',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();

        smartCmsPage.attachUnsupportedFile(staticFixtures.unsupportedAttachmentMediaType);

        smartCmsPage.getPanelMessage().should('have.class', smartCmsPage.getPanelMessageErrorClass()).and('be.visible');
        smartCmsPage.getPanelAttachmentName().should('have.length', 0);
      }
    );

    it(
      'issues the block-scoped generate POST after expanding, typing and attaching in the CMS Block editor',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsBlockEditor();
        smartCmsPage.expandPanel();
        smartCmsPage.interceptGenerateWithProviderFailure();

        smartCmsPage.attachFile(staticFixtures.probeImagePath);
        smartCmsPage.getPanelAttachmentName().should('have.length', 1);

        const prompt = 'Write a short promotional block heading';
        smartCmsPage.typePrompt(prompt);
        smartCmsPage.clickAskAi();

        cy.wait('@generateRequest').then((interception): void => {
          const body = interception.request.body;
          const payload = typeof body === 'string' ? JSON.parse(body) : body;

          expect(payload).to.have.property('userPrompt', prompt);
          expect(payload).to.have.property('entityType', staticFixtures.cmsBlockEntityType);
          expect(payload).to.have.property('idEntity', staticFixtures.cmsBlockIdEntity);
          expect(payload.attachments).to.be.an('array').with.length(1);
        });

        smartCmsPage.getPanelMessage().should('have.class', smartCmsPage.getPanelMessageErrorClass()).and('be.visible');
      }
    );

    describe('real AI provider generate (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      it(
        'drives the real generate (with and without an attachment) and writes the returned content into the glossary editor',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          smartCmsPage.visitCmsPageEditor();
          smartCmsPage.expandPanel();
          smartCmsPage.interceptRealGenerate();

          smartCmsPage.typePrompt(smartCmsPage.getHeroPrompt());
          smartCmsPage.clickAskAi();

          cy.wait('@generateRequest', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          smartCmsPage.getPanelSuccessMessage().should('be.visible');
          smartCmsPage.getPanelAsk().should('be.visible').and('not.be.disabled');
          smartCmsPage.assertGlossaryEditorPopulated();

          smartCmsPage.visitCmsPageEditor();
          smartCmsPage.expandPanel();
          smartCmsPage.interceptRealGenerate();

          smartCmsPage.attachFile(staticFixtures.probeImagePath);
          smartCmsPage.getPanelAttachmentName().should('have.length', 1);

          smartCmsPage.typePrompt('Use the attached image to suggest a hero title and matching intro copy');
          smartCmsPage.clickAskAi();

          cy.wait('@generateRequest', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          smartCmsPage.getPanelSuccessMessage().should('be.visible');
        }
      );
    });

    describe(
      'real AI provider generate against AWS Bedrock (full, requires provider token)',
      { tags: ['@demo-full'] },
      (): void => {
        let switchedToAws = false;

        after((): void => {
          if (!switchedToAws) {
            return;
          }

          restoreSmartCmsOpenAiVendor();
        });

        const driveRealGenerate = (editor: {
          visit: () => Cypress.Chainable;
          entityType: string;
          prompt: string;
        }): void => {
          editor.visit();
          cy.window().its(smartCmsPage.getContentConfigWindowKey()).its('entityType').should('eq', editor.entityType);
          smartCmsPage.getPanelToggle().should('be.visible');
          smartCmsPage.expandPanel();
          smartCmsPage.interceptRealGenerate();

          smartCmsPage.typePrompt(editor.prompt);
          clickAskAiAndAwaitRealGenerate();

          smartCmsPage.getPanelSuccessMessage().should('be.visible');
          smartCmsPage.assertGlossaryEditorPopulated();
        };

        it(
          'drives real generate on both a CMS Page and a CMS Block against AWS Bedrock and logs a configuration-filterable audit row',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            switchedToAws = true;
            aiConfigurationPage.setFeatureVendor('smart_cms', 'aws');

            driveRealGenerate({
              visit: () => smartCmsPage.visitCmsPageEditor(),
              entityType: staticFixtures.cmsPageEntityType,
              prompt: smartCmsPage.getHeroPrompt(),
            });

            driveRealGenerate({
              visit: () => smartCmsPage.visitCmsBlockEditor(),
              entityType: staticFixtures.cmsBlockEntityType,
              prompt: smartCmsPage.getBlockPrompt(),
            });

            restoreSmartCmsOpenAiVendor();

            auditLogsPage.assertNewestRowConfigurationIsFilterable('AWS');
          }
        );
      }
    );
  }
);
