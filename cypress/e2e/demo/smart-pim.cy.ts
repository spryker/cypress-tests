import { container, skipUnlessAiProviderEnabled } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { AiConfigurationPage, AuditLogsPage, SmartPimPage } from '@pages/backoffice';
import { SmartPimDemoStaticFixtures } from '@interfaces/demo';

const SMART_PIM_FEATURE = 'smart_pim';
const REAL_FLOW_TIMEOUT = 15000;

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
          .and('have.attr', 'data-url', smartPimPage.getCategorySuggestionPath())
          .and('have.attr', 'popovertarget', smartPimPage.getCategoryModalId());
        smartPimPage.getAltImageTriggers().should('have.length.at.least', 1);

        smartPimPage.getCategoryModal().should('exist');
        smartPimPage.getAltTextModal().should('exist');
        smartPimPage.getTranslationModal().should('exist');
        smartPimPage.getAllActionsPopover().should('exist');
        smartPimPage.getLocaleSelectorPopover().should('exist');
      }
    );

    it(
      'opening the AI-assist controls (load, all-actions, locale-selector) fires no provider request',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartPimPage.getProviderEndpointGlobs().forEach((endpoint, index): void => {
          cy.intercept('POST', endpoint).as(`providerCall${index}`);
        });

        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
        smartPimPage.getCategoryTrigger().should('be.visible');

        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
        smartPimPage
          .getTranslateActionButton()
          .should('be.visible')
          .and('have.attr', 'data-target-popover', '.locale-selector-popover');
        smartPimPage
          .getImproveContentButton()
          .should('be.visible')
          .and('have.attr', 'data-request-url', smartPimPage.getContentImproverPath())
          .and('have.attr', 'data-request-ready');

        smartPimPage.closeAllActionsPopover();
        smartPimPage.shouldBeClosedPopover(smartPimPage.getAllActionsPopover());
        smartPimPage.openAllActionsPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());

        smartPimPage.openLocaleSelectorPopover();
        smartPimPage.shouldBeOpenPopover(smartPimPage.getLocaleSelectorPopover());
        smartPimPage
          .getLocaleButtons()
          .should('have.length.at.least', 1)
          .and('have.attr', 'data-request-url', smartPimPage.getTranslatePath());

        smartPimPage.getProviderEndpointGlobs().forEach((_endpoint, index): void => {
          cy.get(`@providerCall${index}.all`).should('have.length', 0);
        });
      }
    );

    it(
      'opens the category and alt-text modals in their empty state for an empty product and fires no provider request',
      { tags: ['@demo-smoke'] },
      (): void => {
        const emptyStateModals = [
          {
            endpoint: `**${smartPimPage.getCategorySuggestionPath()}`,
            alias: 'categorySuggestion',
            prepare: (): void => {
              smartPimPage.clearInformationalFields();
            },
            trigger: (): void => {
              smartPimPage.clickCategoryTrigger();
            },
            getModal: (): Cypress.Chainable => smartPimPage.getCategoryModal(),
            getEmptyText: (): Cypress.Chainable => smartPimPage.getCategoryModalEmptyText(),
            emptyText: smartPimPage.getCategoryEmptyText(),
            getField: (): Cypress.Chainable => smartPimPage.getCategorySelect(),
          },
          {
            endpoint: `**${smartPimPage.getImageAltTextPath()}`,
            alias: 'imageAltText',
            prepare: (): void => {
              smartPimPage.clearImageUrlFields();
            },
            trigger: (): void => {
              smartPimPage.clickFirstAltImageTrigger();
            },
            getModal: (): Cypress.Chainable => smartPimPage.getAltTextModal(),
            getEmptyText: (): Cypress.Chainable => smartPimPage.getAltTextModalEmptyText(),
            emptyText: smartPimPage.getAltTextEmptyText(),
            getField: (): Cypress.Chainable => smartPimPage.getAltTextInput(),
          },
        ];

        emptyStateModals.forEach((modal): void => {
          cy.intercept('POST', modal.endpoint).as(modal.alias);

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
          modal.prepare();
          modal.trigger();

          smartPimPage.shouldBeOpenPopover(modal.getModal());
          modal.getModal().should('have.class', smartPimPage.getEmptyClass());
          modal.getEmptyText().should('be.visible').and('contain', modal.emptyText);
          modal.getField().should('exist');

          cy.get(`@${modal.alias}.all`).should('have.length', 0);
        });
      }
    );

    it(
      'issues the AI-assist POST for a populated product and shows the error when the provider fails',
      { tags: ['@demo-smoke'] },
      (): void => {
        const failingProviderCalls = [
          {
            endpoint: `**${smartPimPage.getCategorySuggestionPath()}`,
            alias: 'categorySuggestion',
            trigger: (): void => {
              smartPimPage.clickCategoryTrigger();
            },
            expectedBodyKeys: ['product_name', 'product_description'],
            getModal: (): Cypress.Chainable => smartPimPage.getCategoryModal(),
            getErrorHolder: (): Cypress.Chainable => smartPimPage.getCategoryModalErrorHolder(),
            assertControlIntact: (): void => {
              smartPimPage.getCategoryTrigger().should('exist');
            },
          },
          {
            endpoint: `**${smartPimPage.getImageAltTextPath()}`,
            alias: 'imageAltText',
            trigger: (): void => {
              smartPimPage.clickFirstAltImageTrigger();
            },
            expectedBodyKeys: ['imageUrl', 'locale'],
            getModal: (): Cypress.Chainable => smartPimPage.getAltTextModal(),
            getErrorHolder: (): Cypress.Chainable => smartPimPage.getAltTextModalErrorHolder(),
            assertControlIntact: (): void => {
              smartPimPage.getAltImageTriggers().first().should('exist');
            },
          },
        ];

        failingProviderCalls.forEach((call): void => {
          cy.intercept('POST', call.endpoint, {
            statusCode: 503,
            body: { errors: [{ message: smartPimPage.getProviderUnavailableMessage() }] },
          }).as(call.alias);

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);
          call.trigger();

          cy.wait(`@${call.alias}`).then((interception): void => {
            const body = interception.request.body;
            const serialized = typeof body === 'string' ? body : JSON.stringify(body);
            call.expectedBodyKeys.forEach((key): void => {
              expect(serialized).to.include(key);
            });
          });

          call.getModal().should('be.visible').and('not.have.class', smartPimPage.getLoadingClass());
          call.getErrorHolder().should('be.visible').and('contain', smartPimPage.getProviderUnavailableMessage());
          call.assertControlIntact();
        });
      }
    );

    it(
      'answers a param-less request to each of the four AI endpoints with its documented 400 contract',
      { tags: ['@demo-smoke'] },
      (): void => {
        smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

        const contract: Array<{ url: string; expectedMessage: string | null }> = [
          {
            url: smartPimPage.getContentImproverUrl(),
            expectedMessage: smartPimPage.getMissingParamsMessage('content-improver'),
          },
          {
            url: smartPimPage.getImageAltTextUrl(),
            expectedMessage: smartPimPage.getMissingParamsMessage('image-alt-text'),
          },
          { url: smartPimPage.getTranslateUrl(), expectedMessage: smartPimPage.getMissingParamsMessage('translate') },
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

        smartPimPage.getInjectedWrapper(marker).should('have.class', smartPimPage.getAffixClass());
        smartPimPage
          .getInjectedAltTrigger(marker)
          .should('have.length', 1)
          .and('have.attr', 'data-url', smartPimPage.getImageAltTextPath());
      }
    );

    it(
      'surfaces a failed improve-content error in the response popover and leaves the suggestion field empty',
      { tags: ['@demo-smoke'] },
      (): void => {
        cy.intercept('POST', `**${smartPimPage.getContentImproverPath()}`, {
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
        cy.intercept('POST', `**${smartPimPage.getContentImproverPath()}`, {
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
        cy.intercept('POST', `**${smartPimPage.getContentImproverPath()}`, {
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
      let switchedToAws = false;

      const restoreOpenAiVendor = (): void => {
        aiConfigurationPage.setFeatureVendor(SMART_PIM_FEATURE, 'openai');
      };

      it(
        'improve-content: issues the real POST and populates the suggestion field',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          cy.intercept('POST', `**${smartPimPage.getContentImproverPath()}`).as('contentImprover');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.clickImproveContent();

          cy.wait('@contentImprover', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
          smartPimPage.getResponseErrorBlock().should('not.be.visible');
          smartPimPage.getResponseField().should('not.have.value', '');
        }
      );

      it(
        'category-suggestion: issues the real POST and fills the modal with at least one suggestion',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          cy.intercept('POST', `**${smartPimPage.getCategorySuggestionPath()}`).as('categorySuggestion');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.clickCategoryTrigger();

          cy.wait('@categorySuggestion', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          smartPimPage
            .getCategoryModal()
            .should('be.visible')
            .and('not.have.class', smartPimPage.getLoadingClass())
            .and('not.have.class', smartPimPage.getEmptyClass());
          smartPimPage.getCategorySelectOptions().should('have.length.at.least', 1);

          smartPimPage.clickCategoryModalApply();
          smartPimPage.getOuterCategorySelect().find('option:selected').should('have.length.at.least', 1);
        }
      );

      it(
        'image-alt-text: issues the real POST and fills the alt-text field',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          cy.intercept('POST', `**${smartPimPage.getImageAltTextPath()}`).as('imageAltText');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.clickFirstAltImageTrigger();

          cy.wait('@imageAltText', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          smartPimPage
            .getAltTextModal()
            .should('be.visible')
            .and('not.have.class', smartPimPage.getLoadingClass())
            .and('not.have.class', smartPimPage.getEmptyClass());
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
          skipUnlessAiProviderEnabled(this);

          cy.intercept('POST', `**${smartPimPage.getTranslatePath()}`).as('translate');

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

                cy.wait('@translate', { timeout: REAL_FLOW_TIMEOUT }).then((interception): void => {
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
          skipUnlessAiProviderEnabled(this);

          cy.intercept('POST', `**${smartPimPage.getContentImproverPath()}`).as('contentImprover');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.clickImproveContent();

          cy.wait('@contentImprover', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);
          smartPimPage.getResponseField().should('not.have.value', '');

          smartPimPage
            .getResponseField()
            .invoke('val')
            .then((suggestion): void => {
              smartPimPage.clickResponseApply();

              smartPimPage.shouldBeClosedPopover(smartPimPage.getResponsePopover());
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
        'improve-content: issues the real POST against the AWS Bedrock provider, and the interaction is logged and filterable by its configuration',
        { tags: ['@demo-full'] },
        function (): void {
          skipUnlessAiProviderEnabled(this);

          switchedToAws = true;
          aiConfigurationPage.setFeatureVendor(SMART_PIM_FEATURE, 'aws');

          cy.intercept('POST', `**${smartPimPage.getContentImproverPath()}`).as('contentImprover');

          smartPimPage.visitProductEdit(staticFixtures.product.idProductAbstract);

          smartPimPage.openAllActionsPopover();
          smartPimPage.shouldBeOpenPopover(smartPimPage.getAllActionsPopover());
          smartPimPage.clickImproveContent();

          cy.wait('@contentImprover', { timeout: REAL_FLOW_TIMEOUT })
            .its('response.statusCode')
            .should('be.within', 200, 299);

          smartPimPage.shouldBeOpenPopover(smartPimPage.getResponsePopover());
          smartPimPage.getResponseErrorBlock().should('not.be.visible');
          smartPimPage.getResponseField().should('not.have.value', '');

          auditLogsPage.assertNewestRowConfigurationIsFilterable('AWS');

          restoreOpenAiVendor();
        }
      );

      after((): void => {
        if (!switchedToAws) {
          return;
        }

        userLoginScenario.execute({
          username: staticFixtures.rootUser.username,
          password: staticFixtures.defaultPassword,
        });

        restoreOpenAiVendor();
      });
    });
  }
);
