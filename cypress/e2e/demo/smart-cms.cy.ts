import { container } from '@utils';
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

    const SMART_CMS_VENDOR_SETTING_KEY = 'ai_commerce:smart_cms:ai_vendor:ai_configuration';
    const SMART_CMS_VENDOR_OPENAI_VALUE = 'AI_COMMERCE:AI_CONFIGURATION_SMART_CMS_OPENAI';
    const SMART_CMS_VENDOR_AWS_VALUE = 'AI_COMMERCE:AI_CONFIGURATION_SMART_CMS_AWS';

    const restoreSmartCmsOpenAiVendor = (): Cypress.Chainable =>
      aiConfigurationPage.setVendorConfiguration(
        'ai_commerce',
        'smart_cms',
        SMART_CMS_VENDOR_SETTING_KEY,
        SMART_CMS_VENDOR_OPENAI_VALUE
      );

    /**
     * The panel widget persists its collapsed/expanded state in a single global localStorage key
     * (`smart_cms_panel_state`, not scoped per entity/page — see SmartCmsContentPanelState.js), so
     * expanding it on one editor carries over as already-expanded on the next editor visited in the
     * same browser session. `smartCmsPage.expandPanel()` always clicks the toggle, so calling it when
     * the panel is already expanded collapses it instead. This idempotent helper only clicks when the
     * toggle reports `aria-expanded="false"`, so it is safe to call regardless of the panel's carried-
     * over state across the Page -> Block editor navigation in the AWS case below.
     */
    const ensurePanelExpanded = (): void => {
      smartCmsPage.getPanelToggle().then(($toggle): void => {
        if ($toggle.attr('aria-expanded') === 'true') {
          return;
        }

        smartCmsPage.expandPanel();
      });
    };

    const AWS_GENERATE_ATTEMPT_TIMEOUT_MS = 45000;

    const AWS_GENERATE_MAX_ATTEMPTS = 3;

    type GenerateInterception = { response?: { statusCode?: number } };

    const isSuccessfulInterception = (interception: GenerateInterception): boolean =>
      (interception.response?.statusCode ?? 0) >= 200 && (interception.response?.statusCode ?? 0) <= 299;

    const isSettledInterception = (interception: GenerateInterception): boolean => interception.response !== undefined;

    /**
     * Finds, among the requests logged after `requestCountBeforeClick`, the one this click's own request
     * settled to — so callers never mistake a still-in-flight request (present in `.all` the instant it's
     * sent, before any response arrives) for a failure.
     */
    const findSettledInterceptionForClick = (
      allInterceptions: Array<GenerateInterception>,
      requestCountBeforeClick: number
    ): GenerateInterception | undefined => allInterceptions.slice(requestCountBeforeClick).find(isSettledInterception);

    /**
     * AWS Bedrock is genuinely slower than OpenAI in this environment and, on rare occasions, a single
     * generate call doesn't respond at all within a reasonable window (observed as a `cy.wait()` timeout
     * with "No response ever occurred" — Cypress gives up before the network layer ever sees a response).
     * `cy.wait()` itself can't be retried inline (a timed-out Cypress command can't be caught with
     * try/catch or .catch() — see Cypress's own docs on conditional testing), so this polls the
     * intercept's own captured requests instead via `cy.get('@alias.all').should(...)`, which is a query
     * and retries natively like any other Cypress assertion instead of hard-failing on the first check.
     *
     * Critically, the poll asserts that the request logged for THIS click has a *settled* `response`
     * (not merely that a new entry exists in `.all` — an entry appears the instant the request is SENT,
     * before any response arrives, so checking only "a new request exists" would treat a still-in-flight
     * request as a failure and click Ask AI again while the original one is genuinely still pending).
     *
     * A real user facing a hung "Ask AI" click would just click it again, so on top of that this
     * bound-retries the click itself: only once a full attempt's polling window elapses with the request
     * for this click still never having settled a response at all does it re-click, up to
     * AWS_GENERATE_MAX_ATTEMPTS attempts total. Only fails the test once every attempt is exhausted, so the
     * case still requires a real eventual 2xx generate — it just tolerates one slow/hung Bedrock call.
     */
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

    it('renders the Smart CMS panel on the CMS Page editor', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.visitCmsPageEditor().its('response.statusCode').should('eq', 200);

      smartCmsPage.getPanel().should('be.visible');
      smartCmsPage.getPanelToggle().should('be.visible').and('contain.text', 'Smart CMS Content Assistant');
    });

    it(
      'renders the Smart CMS panel and its inline config on the CMS Block editor',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsBlockEditor().its('response.statusCode').should('eq', 200);

        smartCmsPage.getPanel().should('be.visible');
        smartCmsPage.getPanelToggle().should('be.visible');

        cy.window().its('SmartCmsContentConfig').should('be.an', 'object');
      }
    );

    it(
      'reveals the prompt input, Ask AI button and attach control when the panel toggle is clicked',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();

        smartCmsPage.getPanelInput().should('exist');
        smartCmsPage.getPanelAsk().should('exist');
        smartCmsPage.getPanelAttach().should('exist');

        smartCmsPage.getPanelToggle().click();

        smartCmsPage
          .getPanelInput()
          .should('be.visible')
          .and('have.attr', 'placeholder', 'Ask AI to generate or edit the title and content…');
        smartCmsPage.getPanelAsk().should('be.visible').and('contain.text', 'Ask AI');
        smartCmsPage.getPanelAttach().should('be.visible');
      }
    );

    it('accepts typed text in the prompt input once the panel is expanded', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.visitCmsPageEditor();
      smartCmsPage.expandPanel();

      smartCmsPage.typePrompt('Write a punchy hero title for this landing page');
    });

    it('lists an attached file by its name after using the attach control', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.visitCmsPageEditor();
      smartCmsPage.expandPanel();

      smartCmsPage.attachFile(staticFixtures.probeImagePath);

      smartCmsPage.getPanelAttachmentName().should('have.length', 1).and('contain.text', 'search-by-image-probe.png');
    });

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

        smartCmsPage.getPanelMessage().should('have.class', 'smart-cms-panel__message--error').and('be.visible');
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

    it('rejects a GET and a token-less POST to the generate endpoint with 403', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.requestGenerate(staticFixtures.generateEndpointPath, { method: 'GET' }).then((response): void => {
        expect(response.status).to.eq(403);
      });

      smartCmsPage
        .requestGenerate(staticFixtures.generateEndpointPath, { method: 'POST', body: {} })
        .then((response): void => {
          expect(response.status).to.eq(403);
        });
    });

    it('rejects an invalid CSRF token with 403 and the invalid-csrf error key', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage
        .requestGenerate(staticFixtures.generateEndpointPath, {
          method: 'POST',
          body: { _token: 'not-a-valid-token', userPrompt: 'x' },
        })
        .then((response): void => {
          expect(response.status).to.eq(403);
          expect(response.body).to.have.property('error', staticFixtures.invalidCsrfErrorKey);
        });
    });

    it(
      'rejects the generate request with the disabled error key ahead of the CSRF check when the feature is off',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.disableSmartCms();

        smartCmsPage
          .requestGenerate(staticFixtures.generateEndpointPath, {
            method: 'POST',
            body: { _token: 'not-a-valid-token' },
          })
          .then((response): void => {
            expect(response.status).to.eq(403);
            expect(response.body).to.have.property('error', staticFixtures.disabledErrorKey);
          });

        smartCmsPage.enableSmartCms();
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
        smartCmsPage.getPanelMessage().should('not.have.class', 'smart-cms-panel__message--visible');
      }
    );

    it(
      'rejects an unsupported file type client-side with an error and does not list it as an attachment',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartCmsPage.visitCmsPageEditor();
        smartCmsPage.expandPanel();

        smartCmsPage.attachUnsupportedFile(staticFixtures.unsupportedAttachmentMediaType);

        smartCmsPage.getPanelMessage().should('have.class', 'smart-cms-panel__message--error').and('be.visible');
        smartCmsPage.getPanelAttachmentName().should('have.length', 0);
      }
    );

    it('clears an attached file from the list via its remove control', { tags: ['@demo-smoke'] }, (): void => {
      smartCmsPage.visitCmsPageEditor();
      smartCmsPage.expandPanel();

      smartCmsPage.attachFile(staticFixtures.probeImagePath);
      smartCmsPage.getPanelAttachmentName().should('have.length', 1);

      smartCmsPage.removeFirstAttachment();
      smartCmsPage.getPanelAttachmentName().should('have.length', 0);
    });

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

        smartCmsPage.getPanelMessage().should('have.class', 'smart-cms-panel__message--error').and('be.visible');
      }
    );

    describe('real AI provider generate (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      it(
        'drives the real generate and surfaces a success message in the panel',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          smartCmsPage.visitCmsPageEditor();
          smartCmsPage.expandPanel();
          smartCmsPage.interceptRealGenerate();

          smartCmsPage.typePrompt('Write a punchy hero title and a short intro paragraph for this landing page');
          smartCmsPage.clickAskAi();

          cy.wait('@generateRequest', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartCmsPage.getPanelSuccessMessage().should('be.visible');
          smartCmsPage.getPanelAsk().should('be.visible').and('not.be.disabled');
        }
      );

      it(
        'drives the real generate with an attachment and surfaces a success message',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          smartCmsPage.visitCmsPageEditor();
          smartCmsPage.expandPanel();
          smartCmsPage.interceptRealGenerate();

          smartCmsPage.attachFile(staticFixtures.probeImagePath);
          smartCmsPage.getPanelAttachmentName().should('have.length', 1);

          smartCmsPage.typePrompt('Use the attached image to suggest a hero title and matching intro copy');
          smartCmsPage.clickAskAi();

          cy.wait('@generateRequest', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartCmsPage.getPanelSuccessMessage().should('be.visible');
          smartCmsPage.getPanelAsk().should('be.visible').and('not.be.disabled');
        }
      );

      it(
        'writes the returned content into a glossary editor field on a successful real generate',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          smartCmsPage.visitCmsPageEditor();
          smartCmsPage.expandPanel();
          smartCmsPage.interceptRealGenerate();

          smartCmsPage.typePrompt('Write a punchy hero title and a short intro paragraph for this landing page');
          smartCmsPage.clickAskAi();

          cy.wait('@generateRequest', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartCmsPage.getPanelSuccessMessage().should('be.visible');
          smartCmsPage
            .getGlossaryEditor()
            .invoke('val')
            .then((value): void => {
              expect(String(value ?? '')).to.have.length.greaterThan(0);
            });
        }
      );
    });

    describe(
      'real AI provider generate against AWS Bedrock (full, requires provider token)',
      { tags: ['@demo-full'] },
      (): void => {
        // Tracks whether this suite actually switched the vendor to AWS, so the after() safety-net
        // below only restores OpenAI when the switch really happened. A grep run that filters out the
        // `it` below by tag (e.g. a @demo-smoke-only run) still executes this describe's after() hook —
        // Cypress.env('DEMO_AI_PROVIDER_ENABLED') alone is not a reliable guard for that hook, since it
        // reflects env config (often true in local .env files), not whether the AWS switch ran.
        let switchedToAws = false;

        after((): void => {
          if (!switchedToAws) {
            return;
          }

          restoreSmartCmsOpenAiVendor();
        });

        it(
          'drives real generate on both a CMS Page and a CMS Block against AWS Bedrock and logs a configuration-filterable audit row',
          { tags: ['@demo-full'] },
          function (): void {
            if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
              this.skip();
            }

            switchedToAws = true;
            aiConfigurationPage.setVendorConfiguration(
              'ai_commerce',
              'smart_cms',
              SMART_CMS_VENDOR_SETTING_KEY,
              SMART_CMS_VENDOR_AWS_VALUE
            );

            smartCmsPage.visitCmsPageEditor();
            // Confirms the Page editor's own JS config is present before interacting, so the panel
            // widget has had a chance to read its (possibly carried-over, see ensurePanelExpanded)
            // localStorage state before we inspect or click the toggle.
            cy.window().its('SmartCmsContentConfig').its('entityType').should('eq', staticFixtures.cmsPageEntityType);
            smartCmsPage.getPanelToggle().should('be.visible');
            ensurePanelExpanded();
            smartCmsPage.interceptRealGenerate();

            smartCmsPage.typePrompt('Write a punchy hero title and a short intro paragraph for this landing page');
            clickAskAiAndAwaitRealGenerate();

            smartCmsPage.getPanelSuccessMessage().should('be.visible');
            smartCmsPage
              .getGlossaryEditor()
              .invoke('val')
              .then((value): void => {
                expect(String(value ?? '')).to.have.length.greaterThan(0);
              });

            smartCmsPage.visitCmsBlockEditor();
            // Same settle-check as the Page editor visit above, scoped to the Block editor's own config.
            // ensurePanelExpanded() (not a plain expandPanel()) matters here: the panel already carried
            // over "expanded" from the Page editor visit above via the shared localStorage state, so a
            // plain expandPanel() would collapse it instead of opening it.
            cy.window().its('SmartCmsContentConfig').its('entityType').should('eq', staticFixtures.cmsBlockEntityType);
            smartCmsPage.getPanelToggle().should('be.visible');
            ensurePanelExpanded();
            smartCmsPage.interceptRealGenerate();

            smartCmsPage.typePrompt('Write a short promotional block heading and a matching one-line description');
            clickAskAiAndAwaitRealGenerate();

            smartCmsPage.getPanelSuccessMessage().should('be.visible');
            smartCmsPage
              .getGlossaryEditor()
              .invoke('val')
              .then((value): void => {
                expect(String(value ?? '')).to.have.length.greaterThan(0);
              });

            restoreSmartCmsOpenAiVendor();

            auditLogsPage.fetchRecentTableData().then(({ rows }): void => {
              const configurationName = auditLogsPage.getRowConfigurationName(rows[0]);

              // Prove the row is actually the AWS Bedrock configuration — a bare non-empty check would pass on
              // a stale OpenAI row too and silently certify AWS coverage that never happened.
              expect(configurationName, 'newest audit row carries the AWS configuration_name').to.include('AWS');

              auditLogsPage.fetchRecentTableData().then((unfiltered): void => {
                auditLogsPage.fetchTableDataFilteredByConfiguration(configurationName).then((filtered): void => {
                  expect(filtered.rows.length, 'filter narrows to at least the just-created rows').to.be.greaterThan(0);

                  filtered.rows.forEach((row): void => {
                    expect(auditLogsPage.getRowConfigurationName(row)).to.eq(configurationName);
                  });

                  expect(filtered.recordsTotal).to.be.at.most(unfiltered.recordsTotal);
                });
              });
            });
          }
        );
      }
    );
  }
);
