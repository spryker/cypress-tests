import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage, AuditLogsPage, SmartPimPage } from '@pages/backoffice';
import { SmartPimDemoStaticFixtures } from '@interfaces/demo';

const SMART_PIM_AI_VENDOR_SETTING_KEY = 'ai_commerce:smart_pim:ai_vendor:ai_configuration';
const SMART_PIM_AI_VENDOR_OPENAI_VALUE = 'AI_COMMERCE:AI_CONFIGURATION_SMART_PIM_OPENAI';
const SMART_PIM_AI_VENDOR_AWS_VALUE = 'AI_COMMERCE:AI_CONFIGURATION_SMART_PIM_AWS';

describe(
  'Smart PIM - Back Office product AI-assist controls',
  {
    tags: ['@demo', '@smart-pim', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const smartPimPage = container.get(SmartPimPage);
    const aiConfigurationPage = container.get(AiConfigurationPage);
    const auditLogsPage = container.get(AuditLogsPage);

    const PROVIDER_ENDPOINTS: Array<string> = [
      '**/ai-commerce/content-improver',
      '**/ai-commerce/category-suggestion',
      '**/ai-commerce/image-alt-text',
      '**/ai-commerce/translate',
    ];

    let staticFixtures: SmartPimDemoStaticFixtures;

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
      'renders the Smart PIM bundles and AI-assist controls on the product edit page',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartPimPage
          .visitProductEdit(staticFixtures.product.idProductAbstract)
          .its('response.statusCode')
          .should('eq', 200);

        cy.title().should('contain', staticFixtures.product.sku);
        smartPimPage.getSmartPimScript().should('exist');
        smartPimPage.getRequestBuilderScript().should('exist');

        smartPimPage.getRequestBuilderTriggers().should('have.length.at.least', 1).and('be.visible');
        smartPimPage
          .getCategoryTrigger()
          .should('be.visible')
          .and('have.attr', 'data-url', '/ai-commerce/category-suggestion')
          .and('have.attr', 'popovertarget', 'ai-category-modal');
        smartPimPage.getAltImageTriggers().should('have.length.at.least', 1);

        smartPimPage.getCategoryModal().should('exist');
        smartPimPage.getAltTextModal().should('exist');
        smartPimPage.getTranslationModal().should('exist');
        smartPimPage.getAllActionsPopover().should('exist');
        smartPimPage.getLocaleSelectorPopover().should('exist');
      }
    );

    it('makes no AI provider request on load', { tags: ['@demo-smoke'] }, (): void => {
      PROVIDER_ENDPOINTS.forEach((endpoint, index): void => {
        cy.intercept('POST', endpoint).as(`providerCall${index}`);
      });

      smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

      smartPimPage.getCategoryTrigger().should('be.visible');

      PROVIDER_ENDPOINTS.forEach((_endpoint, index): void => {
        cy.get(`@providerCall${index}.all`).should('have.length', 0);
      });
    });

    it(
      'opens the all-actions popover with translate and improve-content choices and fires no provider request',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/content-improver').as('contentImprover');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.openAllActionsPopover();

        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
        smartPimPage
          .getTranslateActionButton()
          .should('be.visible')
          .and('have.attr', 'data-target-popover', '.locale-selector-popover');
        smartPimPage
          .getImproveContentButton()
          .should('be.visible')
          .and('have.attr', 'data-request-url', '/ai-commerce/content-improver')
          .and('have.attr', 'data-request-ready');

        cy.get('@contentImprover.all').should('have.length', 0);
      }
    );

    it(
      'closes and reopens the all-actions popover without firing a provider request',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/content-improver').as('contentImprover');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());

        smartPimPage.closeAllActionsPopover();
        smartPimPage.shouldBeClosedPopover(smartPimPage.getAllActionsPopover());

        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());

        cy.get('@contentImprover.all').should('have.length', 0);
      }
    );

    it(
      'opens the locale-selector popover with locale buttons and fires no translate request',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/translate').as('translate');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());

        smartPimPage.openLocaleSelectorPopover();

        smartPimPage.shouldBeOpenPopover(smartPimPage.getLocaleSelectorPopover());
        smartPimPage
          .getLocaleButtons()
          .should('have.length.at.least', 1)
          .and('have.attr', 'data-request-url', '/ai-commerce/translate');

        cy.get('@translate.all').should('have.length', 0);
      }
    );

    it(
      'opens the category modal in its empty state for an empty product and fires no provider request',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/category-suggestion').as('categorySuggestion');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
        smartPimPage.clearInformationalFields();

        smartPimPage.clickCategoryTrigger();

        smartPimPage.shouldBeOpenPopover(smartPimPage.getCategoryModal());
        smartPimPage.getCategoryModal().should('have.class', 'is-empty');
        smartPimPage.getCategoryModalEmptyText().should('be.visible').and('contain', 'Please fill in the product name');
        smartPimPage.getCategorySelect().should('exist');

        cy.get('@categorySuggestion.all').should('have.length', 0);
      }
    );

    it(
      'opens the alt-text modal in its empty state for an empty image url and fires no provider request',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/image-alt-text').as('imageAltText');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
        smartPimPage.clearImageUrlFields();

        smartPimPage.clickFirstAltImageTrigger();

        smartPimPage.shouldBeOpenPopover(smartPimPage.getAltTextModal());
        smartPimPage.getAltTextModal().should('have.class', 'is-empty');
        smartPimPage
          .getAltTextModalEmptyText()
          .should('be.visible')
          .and('contain', 'Please fill in the product image url');
        smartPimPage.getAltTextInput().should('exist');

        cy.get('@imageAltText.all').should('have.length', 0);
      }
    );

    it(
      'issues the category-suggestion POST for a populated product and shows the error when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/category-suggestion', {
          statusCode: 503,
          body: { errors: [{ message: 'AI provider unavailable' }] },
        }).as('categorySuggestion');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.clickCategoryTrigger();

        cy.wait('@categorySuggestion').then((interception): void => {
          const body = interception.request.body as string;
          expect(body).to.include('product_name');
          expect(body).to.include('product_description');
        });

        smartPimPage.getCategoryModal().should('be.visible').and('not.have.class', 'is-loading');
        smartPimPage.getCategoryModalErrorHolder().should('be.visible').and('contain', 'AI provider unavailable');
        smartPimPage.getCategoryTrigger().should('exist');
      }
    );

    it(
      'issues the image-alt-text POST for a populated image and shows the error when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/image-alt-text', {
          statusCode: 503,
          body: { errors: [{ message: 'AI provider unavailable' }] },
        }).as('imageAltText');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.clickFirstAltImageTrigger();

        cy.wait('@imageAltText').then((interception): void => {
          const body = interception.request.body;
          const serialized = typeof body === 'string' ? body : JSON.stringify(body);
          expect(serialized).to.include('imageUrl');
          expect(serialized).to.include('locale');
        });

        smartPimPage.getAltTextModal().should('be.visible').and('not.have.class', 'is-loading');
        smartPimPage.getAltTextModalErrorHolder().should('be.visible').and('contain', 'AI provider unavailable');
        smartPimPage.getAltImageTriggers().first().should('exist');
      }
    );

    it(
      'answers a param-less request to each of the four AI endpoints with its documented 400 contract',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        const contract: Array<{ url: string; expectedMessage: string | null }> = [
          { url: smartPimPage.getContentImproverUrl(), expectedMessage: 'Text is missing from request.' },
          {
            url: smartPimPage.getImageAltTextUrl(),
            expectedMessage: 'ImageUrl and/or target locale are missing from request.',
          },
          {
            url: smartPimPage.getTranslateUrl(),
            expectedMessage: 'Text and/or target locales are missing from request.',
          },
          { url: smartPimPage.getCategorySuggestionUrl(), expectedMessage: null },
        ];

        contract.forEach(({ url, expectedMessage }): void => {
          (['GET', 'POST'] as Array<Cypress.HttpMethod>).forEach((method): void => {
            cy.request({ method, url, failOnStatusCode: false }).then((response): void => {
              expect(response.status, `${method} ${url}`).to.eq(400);

              if (expectedMessage !== null) {
                expect(JSON.stringify(response.body)).to.contain(expectedMessage);
              }
            });
          });
        });
      }
    );

    it(
      'injects a fresh alt-text trigger into an image wrapper added to the DOM after load',
      { tags: ['@demo-smoke'] },
      (): void => {
        const marker = 'cypress-injected-image-wrapper';

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.getAltTriggerTemplate().should('exist');
        smartPimPage.appendImageAltTextWrapper(marker);

        smartPimPage
          .getInjectedWrapper(marker)
          .should('have.class', smartPimPage.getAffixClass())
          .find('.js-ai-alt-image-trigger')
          .should('have.length', 1)
          .and('have.attr', 'data-url', '/ai-commerce/image-alt-text');
      }
    );

    it(
      'surfaces a failed improve-content error in the response popover and leaves the suggestion field empty',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/content-improver', {
          statusCode: 422,
          body: { errors: [{ message: 'Content generation failed' }] },
        }).as('contentImprover');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
        smartPimPage.clickImproveContent();

        cy.wait('@contentImprover');

        smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
        smartPimPage.getResponseErrorBlock().should('be.visible').and('contain', 'Content generation failed');
        smartPimPage.getResponseField().should('have.value', '');
      }
    );

    it(
      're-issues the improve-content request from the "try again" button without reopening the action popover',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/content-improver', {
          statusCode: 200,
          body: { improvedText: 'stubbed improved copy' },
        }).as('contentImprover');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
        smartPimPage.clickImproveContent();

        cy.wait('@contentImprover');
        smartPimPage.getResponseField().should('have.value', 'stubbed improved copy');

        smartPimPage.clickResponseAgain();

        cy.wait('@contentImprover');
        cy.get('@contentImprover.all').should('have.length', 2);
        smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
      }
    );

    it(
      'writes the accepted suggestion back into the source field and closes the popovers on "apply"',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', '**/ai-commerce/content-improver', {
          statusCode: 200,
          body: { improvedText: 'applied suggestion text' },
        }).as('contentImprover');

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
        smartPimPage.clickImproveContent();

        cy.wait('@contentImprover');
        smartPimPage.getResponseField().should('have.value', 'applied suggestion text');

        smartPimPage.clickResponseApply();

        smartPimPage.shouldBeClosedPopover(smartPimPage.getResponsePopover());
      }
    );

    it(
      'hides the locale-selector button for the field locale the trigger was opened from',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        smartPimPage.getFirstRequestBuilderLocale().then((currentLocale): void => {
          expect(currentLocale, 'trigger exposes its field locale').to.be.a('string').and.not.be.empty;

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.openLocaleSelectorPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getLocaleSelectorPopover());

          smartPimPage.getLocaleButtonFor(currentLocale as string).should('have.attr', 'hidden');
          smartPimPage.getLocaleButtons().filter(':visible').should('have.length.at.least', 1);
        });
      }
    );

    describe('real AI provider flow (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
      // Set true only inside the AWS case (after this.skip()). The after() restore gates on THIS, not on
      // Cypress.env('DEMO_AI_PROVIDER_ENABLED') — .env hardcodes that flag to 1, so it stays truthy even on
      // a @demo-smoke-only run where the AWS it() never executes; gating on it would make after() do a
      // needless login + config visit every smoke run.
      let switchedToAws = false;

      it(
        'improve-content: issues the real POST and populates the suggestion field',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          cy.intercept('POST', '**/ai-commerce/content-improver').as('contentImprover');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.clickImproveContent();

          cy.wait('@contentImprover', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
          smartPimPage.getResponseErrorBlock().should('not.be.visible');
          smartPimPage.getResponseField().should('not.have.value', '');
        }
      );

      it(
        'translate: choosing a locale issues the real POST and populates the suggestion field',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          cy.intercept('POST', '**/ai-commerce/translate').as('translate');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.openLocaleSelectorPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getLocaleSelectorPopover());
          smartPimPage.clickFirstLocaleButton();

          cy.wait('@translate', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
          smartPimPage.getResponseErrorBlock().should('not.be.visible');
          smartPimPage.getResponseField().should('not.have.value', '');
        }
      );

      it(
        'category-suggestion: issues the real POST and fills the modal with at least one suggestion',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          cy.intercept('POST', '**/ai-commerce/category-suggestion').as('categorySuggestion');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.clickCategoryTrigger();

          cy.wait('@categorySuggestion', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartPimPage
            .getCategoryModal()
            .should('be.visible')
            .and('not.have.class', 'is-loading')
            .and('not.have.class', 'is-empty');
          smartPimPage.getCategorySelectOptions().should('have.length.at.least', 1);

          smartPimPage.clickCategoryModalApply();
          smartPimPage.getOuterCategorySelect().find('option:selected').should('have.length.at.least', 1);
        }
      );

      it(
        'image-alt-text: issues the real POST and fills the alt-text field',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          cy.intercept('POST', '**/ai-commerce/image-alt-text').as('imageAltText');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.clickFirstAltImageTrigger();

          cy.wait('@imageAltText', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartPimPage
            .getAltTextModal()
            .should('be.visible')
            .and('not.have.class', 'is-loading')
            .and('not.have.class', 'is-empty');
          smartPimPage.getAltTextInput().should('not.have.value', '');

          smartPimPage
            .getAltTextInput()
            .invoke('val')
            .then((generatedAltText): void => {
              smartPimPage.clickAltTextModalApply();
              smartPimPage.getFirstTriggeredAltTextField().should('have.value', generatedAltText);
            });
        }
      );

      it(
        'translate: posts a target locale different from the source and returns its translation',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          cy.intercept('POST', '**/ai-commerce/translate').as('translate');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.getFirstRequestBuilderLocale().then((currentLocale): void => {
            smartPimPage.openAllActionsPopover();
            smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
            smartPimPage.openLocaleSelectorPopover();
            smartPimPage.shouldBeOpenPopover(smartPimPage.getLocaleSelectorPopover());

            smartPimPage
              .getLocaleButtons()
              .filter(':visible')
              .first()
              .then(($button): void => {
                const targetLocale = $button.attr('data-locale') ?? '';
                expect(targetLocale, 'a target locale distinct from the source is offered').to.not.eq(currentLocale);

                smartPimPage.clickLocaleButtonFor(targetLocale);

                cy.wait('@translate', { timeout: 15000 }).then((interception): void => {
                  expect(interception.response?.statusCode).to.be.within(200, 299);
                  const serialized =
                    typeof interception.request.body === 'string'
                      ? interception.request.body
                      : JSON.stringify(interception.request.body);
                  expect(serialized).to.contain(targetLocale);
                });

                smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
                smartPimPage.getResponseErrorBlock().should('not.be.visible');
                smartPimPage.getResponseField().should('not.have.value', '');
              });
          });
        }
      );

      it(
        'improve-content: applying the suggestion writes it back into the source description field',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          cy.intercept('POST', '**/ai-commerce/content-improver').as('contentImprover');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.clickImproveContent();

          cy.wait('@contentImprover', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);
          smartPimPage.getResponseField().should('not.have.value', '');

          smartPimPage
            .getResponseField()
            .invoke('val')
            .then((suggestion): void => {
              smartPimPage.clickResponseApply();

              smartPimPage.getResponsePopover().should(($el): void => {
                expect($el[0].matches(smartPimPage['repository'].getOpenPopoverState())).to.eq(false);
              });
              // The real provider's response text is copied verbatim, but its whitespace (e.g. paragraph
              // breaks) can be re-rendered with different line-break formatting between the two reads —
              // normalize before comparing so the assertion proves the content transferred, not exact
              // byte-for-byte formatting.
              smartPimPage
                .getFirstRequestBuilderTargetField()
                .invoke('val')
                .then((appliedValue): void => {
                  const normalize = (value: unknown): string =>
                    String(value ?? '')
                      .replace(/\s+/g, ' ')
                      .trim();

                  expect(normalize(appliedValue)).to.eq(normalize(suggestion));
                });
            });
        }
      );

      it(
        'improve-content: issues the real POST against the AWS Bedrock provider and populates the suggestion field, and the interaction is logged and filterable by its configuration',
        { tags: ['@demo-full'] },
        function (): void {
          if (!Cypress.env('DEMO_AI_PROVIDER_ENABLED')) {
            this.skip();
          }

          switchedToAws = true;
          aiConfigurationPage.setVendorConfiguration(
            'ai_commerce',
            'smart_pim',
            SMART_PIM_AI_VENDOR_SETTING_KEY,
            SMART_PIM_AI_VENDOR_AWS_VALUE
          );

          cy.intercept('POST', '**/ai-commerce/content-improver').as('contentImprover');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.clickImproveContent();

          cy.wait('@contentImprover', { timeout: 15000 }).its('response.statusCode').should('be.within', 200, 299);

          smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
          smartPimPage.getResponseErrorBlock().should('not.be.visible');
          smartPimPage.getResponseField().should('not.have.value', '');

          // The improve-content call above is logged as an AI-interaction-log row. Read the newest row's
          // configuration_name (the resolved Bedrock config, e.g. "...SMART_PIM_AWS") rather than
          // hardcoding it, then prove the audit-log table is actually filterable by that value: every
          // row the filtered fetch returns must carry that same configuration_name, and the filtered
          // count can never exceed the unfiltered one.
          auditLogsPage.fetchRecentTableData().then(({ recordsTotal: unfilteredTotal, rows: recentRows }): void => {
            const awsConfigurationName = auditLogsPage.getRowConfigurationName(recentRows[0]);
            // Prove the row is actually the AWS Bedrock configuration — `.not.be.empty` would pass on a
            // stale OpenAI row too and silently certify AWS coverage that never happened.
            expect(awsConfigurationName, 'newest audit-log row carries the AWS configuration name').to.include('AWS');

            auditLogsPage
              .fetchTableDataFilteredByConfiguration(awsConfigurationName)
              .then(({ recordsTotal: filteredTotal, rows: filteredRows }): void => {
                expect(
                  filteredRows,
                  'filter by the AWS configuration returns at least one row'
                ).to.have.length.at.least(1);
                filteredRows.forEach((row): void => {
                  expect(auditLogsPage.getRowConfigurationName(row)).to.eq(awsConfigurationName);
                });
                expect(filteredTotal, 'filtered count never exceeds the unfiltered count').to.be.at.most(
                  unfilteredTotal
                );
              });
          });

          aiConfigurationPage.setVendorConfiguration(
            'ai_commerce',
            'smart_pim',
            SMART_PIM_AI_VENDOR_SETTING_KEY,
            SMART_PIM_AI_VENDOR_OPENAI_VALUE
          );
        }
      );

      after((): void => {
        // Safety net: guarantees Smart PIM ends on the OpenAI vendor even if the AWS case above fails
        // mid-way, since the vendor selection is persisted and would otherwise poison the OpenAI cases.
        // Gate on `switchedToAws` (set only inside the AWS it()), NOT on DEMO_AI_PROVIDER_ENABLED — .env
        // hardcodes that flag to 1, so it's truthy even on a @demo-smoke-only run where the AWS it() never
        // ran and no restore is needed. When we did switch, self-login first (no beforeEach on a full run's
        // after) before visiting the config page to restore.
        if (!switchedToAws) {
          return;
        }

        userLoginScenario.execute({
          username: staticFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        aiConfigurationPage.setVendorConfiguration(
          'ai_commerce',
          'smart_pim',
          SMART_PIM_AI_VENDOR_SETTING_KEY,
          SMART_PIM_AI_VENDOR_OPENAI_VALUE
        );
      });
    });
  }
);
