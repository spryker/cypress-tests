import { container, readChatRequestBody, skipUnlessAiProviderEnabled } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { CustomerLoginScenario } from '@scenarios/yves';
import { AiConfigurationPage, AuditLogsPage } from '@pages/backoffice';
import { StorefrontAssistantPage } from '@pages/yves';
import {
  StorefrontAssistantContractCase,
  StorefrontAssistantDemoStaticFixtures,
  StorefrontAssistantStreamEvent,
} from '@interfaces/demo';

describe(
  'Storefront Assistant - Yves shopping assistant chat',
  {
    tags: ['@demo', '@storefront-assistant', '@ai-commerce'],
  },
  (): void => {
    const userLoginScenario = container.get(UserLoginScenario);
    const customerLoginScenario = container.get(CustomerLoginScenario);
    const storefrontAssistantPage = container.get(StorefrontAssistantPage);
    const aiConfigurationPage = container.get(AiConfigurationPage);
    const auditLogsPage = container.get(AuditLogsPage);

    const TURN_STATE = { idle: 'idle', done: 'done', error: 'error' };

    const FINISHED_TURN_STATES = [TURN_STATE.done, TURN_STATE.error];

    const haveTrimmedText =
      (text: string) =>
      ($element: JQuery): void => {
        expect($element.text().trim()).to.eq(text);
      };

    const OTHER_VENDORS = [
      { vendor: 'aws', auditMarker: 'STOREFRONT_ASSISTANT_AWS' },
      { vendor: 'anthropic', auditMarker: 'STOREFRONT_ASSISTANT_ANTHROPIC' },
    ];

    let staticFixtures: StorefrontAssistantDemoStaticFixtures;

    const loginAdmin = (): void =>
      userLoginScenario.execute({
        username: staticFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

    const loginCustomer = (): void =>
      customerLoginScenario.execute({
        email: staticFixtures.customer.email,
        password: staticFixtures.defaultPassword,
      });

    const setAssistantSettings = (settings: Array<{ settingKey: string; isEnabled: boolean }>): void => {
      loginAdmin();
      settings.forEach(({ settingKey, isEnabled }): void => {
        aiConfigurationPage.setBooleanSetting(
          storefrontAssistantPage.getConfigurationFeatureKey(),
          storefrontAssistantPage.getFeatureKey(),
          settingKey,
          isEnabled
        );
      });
      storefrontAssistantPage.syncConfiguration();
    };

    const setAssistantVendor = (vendor: string): void => {
      loginAdmin();
      aiConfigurationPage.setFeatureVendor(storefrontAssistantPage.getFeatureKey(), vendor);
      storefrontAssistantPage.syncConfiguration();
    };

    const visitHome = (options?: { keepChatStorage?: boolean }): Cypress.Chainable =>
      storefrontAssistantPage.visitWithChat(staticFixtures.storeLocalePath, options);

    const waitForTurnEnd = (timeout?: number): Cypress.Chainable =>
      storefrontAssistantPage.getChat({ timeout }).should(($chat): void => {
        expect(FINISHED_TURN_STATES).to.include($chat.attr(storefrontAssistantPage.getTurnStateAttributeName()));
      });

    const assertTurnState = (state: string): Cypress.Chainable =>
      storefrontAssistantPage.getChat().should('have.attr', storefrontAssistantPage.getTurnStateAttributeName(), state);

    const waitForPromptBody = (alias = 'sfaPrompt'): Cypress.Chainable<Record<string, unknown>> =>
      cy.wait(`@${alias}`).then((interception) => readChatRequestBody(interception.request.body));

    const assertPromptCount = (count: number): Cypress.Chainable =>
      storefrontAssistantPage.getAlias('sfaPrompt.all').should('have.length', count);

    const streamReply = (events: StorefrontAssistantStreamEvent[]): Record<string, unknown> =>
      storefrontAssistantPage.buildStreamReply(events);

    const productStreamEvents = (): StorefrontAssistantStreamEvent[] =>
      storefrontAssistantPage.buildToolEvents('display_products', staticFixtures.productResult, {
        text: staticFixtures.productAnswerText,
        conversationReference: staticFixtures.stubbedConversationReferences.products,
        agent: staticFixtures.agents[1].value,
      });

    const buildContractBody = (testCase: StorefrontAssistantContractCase, pngContent: string): unknown => {
      if (testCase.method === 'GET') {
        return undefined;
      }

      if (testCase.endpoint !== 'prompt') {
        return testCase.body;
      }

      const body: Record<string, unknown> = { ...staticFixtures.contractPayload, ...testCase.body };

      (testCase.omittedKeys ?? []).forEach((key): void => {
        delete body[key];
      });

      if (testCase.messageLength) {
        body.message = 'a'.repeat(testCase.messageLength);
      }

      if (testCase.validPngAttachmentCount) {
        body.attachments = Array.from({ length: testCase.validPngAttachmentCount }, (_, index) => ({
          name: `cypress-${index}.png`,
          mediaType: staticFixtures.extraAttachmentFile.mediaType,
          content: pngContent,
        }));
      }

      return body;
    };

    const resolveCsrfToken = (testCase: StorefrontAssistantContractCase, csrfToken: string): string | undefined =>
      ({ valid: csrfToken, invalid: storefrontAssistantPage.getInvalidCsrfToken(), none: undefined })[testCase.csrf];

    const runContractCases = (cases: StorefrontAssistantContractCase[]): void => {
      visitHome();
      storefrontAssistantPage.readCsrfToken().then((csrfToken): void => {
        storefrontAssistantPage.readFileAsBase64(staticFixtures.extraAttachmentFile.path).then((pngContent): void => {
          cases.forEach((testCase): void => {
            storefrontAssistantPage
              .requestEndpoint({
                method: testCase.method,
                path: storefrontAssistantPage.getEndpointPath(staticFixtures.storeLocalePath, testCase.endpoint),
                query: testCase.query,
                body: testCase.rawBody === undefined ? buildContractBody(testCase, pngContent) : undefined,
                rawBody: testCase.rawBody,
                contentType: testCase.contentType,
                csrfToken: resolveCsrfToken(testCase, csrfToken),
              })
              .then((response): void => {
                expect(response.status, testCase.description).to.eq(testCase.expectedStatus);

                if (testCase.expectedError !== undefined) {
                  expect(response.body.error, testCase.description).to.eq(testCase.expectedError);
                  expect(String(response.body.error), testCase.description).not.to.match(
                    new RegExp(`^${storefrontAssistantPage.getGlossaryKeyPrefix()}`)
                  );
                }

                if (testCase.expectedDeletedCount !== undefined) {
                  expect(response.body.deletedCount, testCase.description).to.eq(testCase.expectedDeletedCount);
                }

                if (testCase.expectsConversationList) {
                  const conversations = response.body.conversations as Array<Record<string, unknown>>;

                  expect(conversations, testCase.description).to.be.an('array');
                  conversations.forEach((conversation): void => {
                    expect(conversation).to.include.all.keys('conversationReference', 'name', 'updatedAt');
                    expect(conversation.updatedAt).to.be.a('number');
                  });
                }
              });
          });
        });
      });
    };

    before((): void => {
      staticFixtures = Cypress.env('staticFixtures');

      setAssistantSettings([
        { settingKey: storefrontAssistantPage.getEnabledSettingKey(), isEnabled: true },
        { settingKey: storefrontAssistantPage.getProductDiscoveryAgentSettingKey(), isEnabled: true },
      ]);
    });

    it(
      'a guest sees no assistant, and every assistant endpoint refuses the guest with 403',
      { tags: ['@demo-smoke'] },
      (): void => {
        storefrontAssistantPage.visitWithoutChat(staticFixtures.storeLocalePath);

        storefrontAssistantPage.getTrigger().should('have.attr', 'hidden');
        storefrontAssistantPage.getTrigger().should('not.be.visible');
        storefrontAssistantPage.getChat().should('not.exist');
        storefrontAssistantPage.getLauncher().should('not.exist');

        staticFixtures.guestEndpoints.forEach(({ method, endpoint, query, body }): void => {
          storefrontAssistantPage
            .requestEndpoint({
              method,
              path: storefrontAssistantPage.getEndpointPath(staticFixtures.storeLocalePath, endpoint),
              query,
              body,
            })
            .then((response): void => {
              expect(response.status, `${method} ${endpoint}`).to.eq(403);
              expect(response.body.error, `${method} ${endpoint}`).to.eq(staticFixtures.guestError);
            });
        });
      }
    );

    describe('customer chat', (): void => {
      beforeEach((): void => {
        loginCustomer();
      });

      it(
        'the header trigger opens the panel with the greeting, default prompts and all composer controls, and the panel closes with the close button, Esc and the trigger',
        { tags: ['@demo-smoke'] },
        (): void => {
          visitHome();

          storefrontAssistantPage.getTriggerText().should(haveTrimmedText(storefrontAssistantPage.getTitleText()));
          storefrontAssistantPage
            .getTrigger()
            .should('have.attr', 'aria-label', storefrontAssistantPage.getTriggerAriaLabel())
            .and('have.attr', 'aria-pressed', 'false');

          storefrontAssistantPage.openPanel();

          storefrontAssistantPage.getTrigger().should('have.attr', 'aria-pressed', 'true');
          storefrontAssistantPage
            .getPanel()
            .should('be.visible')
            .and('have.attr', 'role', 'dialog')
            .and('have.attr', 'aria-modal', 'true');
          storefrontAssistantPage.getPanelTitle().should(haveTrimmedText(storefrontAssistantPage.getTitleText()));
          storefrontAssistantPage
            .getWelcomeText()
            .should(haveTrimmedText(storefrontAssistantPage.getGreetingText(staticFixtures.customer.firstName)));
          storefrontAssistantPage.getSuggestedPrompts().should('have.length', staticFixtures.defaultPrompts.length);
          staticFixtures.defaultPrompts.forEach((prompt, index): void => {
            storefrontAssistantPage.getSuggestedPrompts().eq(index).should(haveTrimmedText(prompt));
          });
          storefrontAssistantPage.getAgentLabel().should(haveTrimmedText(staticFixtures.agents[0].label));
          storefrontAssistantPage
            .getInput()
            .should('have.attr', 'placeholder', storefrontAssistantPage.getPlaceholderText())
            .and('have.focus');
          storefrontAssistantPage.getHint().should(haveTrimmedText(storefrontAssistantPage.getHintText()));
          storefrontAssistantPage.getDisclosure().should(haveTrimmedText(storefrontAssistantPage.getDisclosureText()));
          [
            storefrontAssistantPage.getAttachButton,
            storefrontAssistantPage.getSendButton,
            storefrontAssistantPage.getMoreToggle,
            storefrontAssistantPage.getExpandButton,
            storefrontAssistantPage.getCloseButton,
          ].forEach((getControl): void => {
            getControl().should('be.visible');
          });
          storefrontAssistantPage.getPageContextChip().should('not.be.visible');
          storefrontAssistantPage.readSessionStorage().its('isOpen').should('eq', true);

          storefrontAssistantPage.closePanel();

          storefrontAssistantPage.getChat().should('not.have.attr', storefrontAssistantPage.getOpenAttributeName());
          storefrontAssistantPage.getPanel().should('not.be.visible').and('have.attr', 'inert');
          storefrontAssistantPage.getTrigger().should('have.attr', 'aria-pressed', 'false');
          storefrontAssistantPage.readSessionStorage().its('isOpen').should('eq', false);

          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.pressEscape();
          storefrontAssistantPage.getChat().should('not.have.attr', storefrontAssistantPage.getOpenAttributeName());

          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.clickTrigger();
          storefrontAssistantPage.getChat().should('not.have.attr', storefrontAssistantPage.getOpenAttributeName());
        }
      );

      it(
        'expand and collapse change the panel width and the page docking, the more menu lists history and new conversation, and the agent picker lists Auto and Product Discovery',
        { tags: ['@demo-smoke'] },
        (): void => {
          visitHome();
          storefrontAssistantPage.openPanel();

          storefrontAssistantPage.getHtml().should('have.attr', storefrontAssistantPage.getDockedAttributeName());
          storefrontAssistantPage
            .getPanel()
            .invoke('outerWidth')
            .then((panelWidth): void => {
              storefrontAssistantPage.getBody().invoke('css', 'padding-right').should('eq', `${panelWidth}px`);
            });

          storefrontAssistantPage.toggleExpand();

          storefrontAssistantPage.getChat().should('have.class', storefrontAssistantPage.getExpandedChatClassName());
          storefrontAssistantPage.getHtml().should('have.attr', storefrontAssistantPage.getExpandedDockAttributeName());
          storefrontAssistantPage
            .getExpandButton()
            .should('have.attr', 'aria-pressed', 'true')
            .and('have.attr', 'aria-label', storefrontAssistantPage.getCollapseLabel());
          storefrontAssistantPage.readSessionStorage().its('isExpanded').should('eq', true);
          [storefrontAssistantPage.getPanelTitleSelector(), storefrontAssistantPage.getAgentToggleSelector()].forEach(
            (selector): void => {
              storefrontAssistantPage.readIsPointInsidePanel(selector).should('eq', true);
            }
          );

          storefrontAssistantPage.toggleExpand();

          storefrontAssistantPage
            .getChat()
            .should('not.have.class', storefrontAssistantPage.getExpandedChatClassName());
          storefrontAssistantPage
            .getHtml()
            .should('not.have.attr', storefrontAssistantPage.getExpandedDockAttributeName());
          storefrontAssistantPage
            .getExpandButton()
            .should('have.attr', 'aria-pressed', 'false')
            .and('have.attr', 'aria-label', storefrontAssistantPage.getExpandLabel());
          storefrontAssistantPage.readSessionStorage().its('isExpanded').should('eq', false);

          storefrontAssistantPage.openMoreMenu();

          storefrontAssistantPage.getMoreMenu().should('be.visible');
          [storefrontAssistantPage.getHistoryMenuLabel(), storefrontAssistantPage.getNewConversationLabel()].forEach(
            (label): void => {
              storefrontAssistantPage
                .getMenuItems()
                .filter(`:contains("${label}")`)
                .should('have.length', 1)
                .and('have.attr', 'role', 'menuitem');
            }
          );

          storefrontAssistantPage.pressEscapeOnFocusedElement();

          storefrontAssistantPage.getMoreMenu().should('not.be.visible');
          storefrontAssistantPage.getChat().should('have.attr', storefrontAssistantPage.getOpenAttributeName());

          storefrontAssistantPage.openAgentMenu();

          storefrontAssistantPage.getAgentOptions().should('have.length', staticFixtures.agents.length);
          staticFixtures.agents.forEach(({ value, label }): void => {
            storefrontAssistantPage.getAgentOption(value).should('contain.text', label);
          });

          storefrontAssistantPage.clickAgentOption(staticFixtures.agents[1].value);

          storefrontAssistantPage
            .getAgentOption(staticFixtures.agents[1].value)
            .should('have.attr', 'aria-checked', 'true');
          storefrontAssistantPage.getAgentLabel().should(haveTrimmedText(staticFixtures.agents[1].label));
          storefrontAssistantPage.readAgentStorage().its('selectedAgent').should('eq', staticFixtures.agents[1].value);

          storefrontAssistantPage.selectAgent(staticFixtures.agents[0].value);

          storefrontAssistantPage.getAgentLabel().should(haveTrimmedText(staticFixtures.agents[0].label));
        }
      );

      it(
        'sending a typed message posts the documented payload with the CSRF header, and the streamed answer renders as markdown with a message-actions bar',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.selectAgent(staticFixtures.agents[1].value);

          storefrontAssistantPage.readCsrfToken().then((csrfToken): void => {
            storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);

            cy.wait('@sfaPrompt').then((interception): void => {
              const headers = interception.request.headers;
              const body = readChatRequestBody(interception.request.body);

              expect(headers[storefrontAssistantPage.getCsrfTokenHeaderName().toLowerCase()]).to.eq(csrfToken);
              expect(headers[storefrontAssistantPage.getRequestedWithHeaderName().toLowerCase()]).to.eq(
                storefrontAssistantPage.getRequestedWithHeaderValue()
              );
              expect(headers['content-type']).to.contain(storefrontAssistantPage.getJsonContentType());
              expect(body.message).to.eq(staticFixtures.messages.simple);
              expect(String(body.conversationReference)).to.match(
                storefrontAssistantPage.getConversationReferencePattern()
              );
              expect(body.attachments).to.deep.eq([]);
              expect(body.selectedAgent).to.eq(staticFixtures.agents[1].value);
              expect(body).not.to.have.property('pageContext');
              expect(body).not.to.have.property('regenerate');
            });
          });

          storefrontAssistantPage.getUserMessages().last().should('contain.text', staticFixtures.messages.simple);
          storefrontAssistantPage.getInput().should('have.value', '');
          storefrontAssistantPage.getLastAnswerStrong().should(haveTrimmedText(staticFixtures.textAnswer.strongText));
          storefrontAssistantPage.getLastAnswerLink(staticFixtures.textAnswer.linkPath).should('exist');
          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage.getWelcomeZone().should('not.be.visible');
          storefrontAssistantPage.getCopyButtons().last().should('be.visible');
          storefrontAssistantPage.getRegenerateButtons().last().should('be.visible');
          storefrontAssistantPage
            .getMessageTimes()
            .last()
            .should('be.visible')
            .invoke('text')
            .should('match', storefrontAssistantPage.getMessageTimePattern());
          storefrontAssistantPage
            .readSessionStorage()
            .its('conversationReference')
            .should('eq', staticFixtures.stubbedConversationReferences.text);

          storefrontAssistantPage.stubClipboard();
          storefrontAssistantPage.clickCopy();

          storefrontAssistantPage
            .getAlias('clipboardWrite')
            .should('have.been.calledOnce')
            .and('have.been.calledWithMatch', staticFixtures.textAnswer.strongText);
          storefrontAssistantPage
            .getCopyStatus()
            .last()
            .should(haveTrimmedText(storefrontAssistantPage.getCopiedText()));
        }
      );

      it(
        'the composer keeps Shift+Enter as a new line, does not send a blank message, and blocks a message above the length limit with a notice',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);

          visitHome();
          storefrontAssistantPage.openPanel();

          storefrontAssistantPage.typeMessage(staticFixtures.messages.multiline[0]);
          storefrontAssistantPage.pressShiftEnter();
          storefrontAssistantPage.typeMessage(staticFixtures.messages.multiline[1]);

          storefrontAssistantPage.getInput().should('have.value', staticFixtures.messages.multiline.join('\n'));

          storefrontAssistantPage.clearInput();
          storefrontAssistantPage.typeMessage('   ');
          storefrontAssistantPage.pressEnter();

          storefrontAssistantPage.readMaxMessageLength().then((maxLength): void => {
            storefrontAssistantPage.setInputValue('a'.repeat(maxLength + 1));
            storefrontAssistantPage.clickSend();

            storefrontAssistantPage
              .getLimitNotice()
              .should('be.visible')
              .and(haveTrimmedText(storefrontAssistantPage.getTooLongNoticeText(maxLength)));
            storefrontAssistantPage.getInput().should('have.attr', 'aria-invalid', 'true');
            storefrontAssistantPage
              .getInput()
              .invoke('val')
              .its('length')
              .should('eq', maxLength + 1);

            storefrontAssistantPage.setInputValue('a');

            storefrontAssistantPage.getLimitNotice().should('not.be.visible');
          });

          assertPromptCount(0);
        }
      );

      it(
        'a streamed reasoning block renders separately from the answer and folds when the answer text starts',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.reasoning);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);
          cy.wait('@sfaPrompt');

          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage
            .getReasoningSummary()
            .should(haveTrimmedText(storefrontAssistantPage.getReasoningSummaryText()));
          storefrontAssistantPage
            .getReasoningParts()
            .should('have.length', 1)
            .and(haveTrimmedText(staticFixtures.reasoningText));
          storefrontAssistantPage.getReasoning().should('not.have.attr', 'open');
          storefrontAssistantPage
            .getLastAnswer()
            .should(haveTrimmedText(staticFixtures.reasoningAnswerText))
            .and('not.contain.text', staticFixtures.reasoningText);
        }
      );

      it(
        'a streamed data-agent part shows the answering agent while the selection is Auto',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);

          waitForPromptBody().its('selectedAgent').should('be.null');

          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage.getAgentLabel().should(haveTrimmedText(staticFixtures.agents[1].label));
          storefrontAssistantPage
            .getAgentToggle()
            .should('have.attr', storefrontAssistantPage.getActiveAttributeName());
          storefrontAssistantPage.readAgentStorage().its('activeAgent').should('eq', staticFixtures.agents[1].value);
        }
      );

      it(
        'the Stop control aborts a running answer, keeps the composer usable and shows no error',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text, { delayMs: 10000 });

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);

          storefrontAssistantPage.getStopButton().should('be.visible');
          storefrontAssistantPage.getSendButton().should('not.be.visible');
          storefrontAssistantPage.getInput().should('be.disabled');
          storefrontAssistantPage.getLoadingRow().should('be.visible');

          storefrontAssistantPage.clickStop();

          assertTurnState(TURN_STATE.idle);
          storefrontAssistantPage.getErrorMessages().should('not.exist');
          storefrontAssistantPage.getSendButton().should('be.visible');
          storefrontAssistantPage.getInput().should('be.enabled');
        }
      );

      it(
        'a display_products result renders the product carousel with prices, reasons, view links, refinements, the see-all link and follow-up prompts',
        { tags: ['@demo-smoke'] },
        (): void => {
          const { products, refinementChips, activeFilters, seeAll } = staticFixtures.productResult;

          storefrontAssistantPage.interceptPromptWithStream(productStreamEvents());

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.products);
          cy.wait('@sfaPrompt');

          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage.getProductCards().should('have.length', products.length);
          products.forEach((product, index): void => {
            storefrontAssistantPage.getProductCardName(index).should(haveTrimmedText(product.name));
            storefrontAssistantPage.getProductCardSku(index).should('contain.text', product.sku);
            storefrontAssistantPage.getProductCardPrice(index).should(haveTrimmedText(product.priceFormatted));
            storefrontAssistantPage.getProductCardReason(index).should(haveTrimmedText(product.reason));
            storefrontAssistantPage
              .getProductCardView(index)
              .should('have.attr', 'href', product.url)
              .and('contain.text', storefrontAssistantPage.getViewProductText());

            if (product.originalPriceFormatted) {
              storefrontAssistantPage
                .getProductCardOriginalPrice(index)
                .should('be.visible')
                .and(haveTrimmedText(product.originalPriceFormatted));
            }
          });
          refinementChips.forEach((chip, index): void => {
            storefrontAssistantPage
              .getRefinementChips()
              .eq(index)
              .should(haveTrimmedText(`${chip.label} (${chip.matchCount})`));
          });
          activeFilters.forEach((filter, index): void => {
            storefrontAssistantPage
              .getFilterPills()
              .eq(index)
              .should('contain.text', filter.label)
              .and('have.attr', 'aria-label', storefrontAssistantPage.getRemoveFilterAriaLabel(filter.label));
          });
          storefrontAssistantPage
            .getSeeAllLink()
            .should(haveTrimmedText(storefrontAssistantPage.getSeeAllText(seeAll.totalResults)))
            .and('have.attr', 'href', `${seeAll.categoryUrl}?${seeAll.queryString}`);
          [
            staticFixtures.productResultPrompt,
            storefrontAssistantPage.getProductPromptText(staticFixtures.productResultNamedPrompt, products[0].name),
          ].forEach((prompt): void => {
            storefrontAssistantPage.getProductPrompts().filter(`:contains("${prompt}")`).should('have.length', 1);
          });
          storefrontAssistantPage.getLastAnswer().should(haveTrimmedText(staticFixtures.productAnswerPlainText));
          storefrontAssistantPage.getCopyButtons().last().should('be.visible');
        }
      );

      it(
        'a refinement chip or a filter pill sends the refinement message, and a follow-up prompt only fills the composer',
        { tags: ['@demo-smoke'] },
        (): void => {
          const chip = staticFixtures.productResult.refinementChips[0];
          const filter = staticFixtures.productResult.activeFilters[0];

          storefrontAssistantPage.interceptPromptWithReplies([
            streamReply(productStreamEvents()),
            streamReply(staticFixtures.streams.text),
          ]);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.products);
          cy.wait('@sfaPrompt');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.clickProductPrompt(staticFixtures.productResultPrompt);

          storefrontAssistantPage.getInput().should('have.value', staticFixtures.productResultPrompt);
          assertPromptCount(1);

          storefrontAssistantPage.clearInput();
          storefrontAssistantPage.clickRefinementChip(0);

          waitForPromptBody()
            .its('message')
            .should('eq', storefrontAssistantPage.getRefinementMessage(chip.label, chip.filterArgument, chip.value));
          storefrontAssistantPage
            .getUserMessages()
            .last()
            .invoke('text')
            .invoke('trim')
            .should('eq', storefrontAssistantPage.getRefinementDisplayText(chip.label));
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.clickFilterPill(0);

          waitForPromptBody()
            .its('message')
            .should('eq', storefrontAssistantPage.getRemoveFilterMessage(filter.label, filter.filterArgument));
        }
      );

      it(
        'selecting two cards for comparison sends the compare message, and the comparison result opens a table view with a differences switch and no full-comparison link',
        { tags: ['@demo-smoke'] },
        (): void => {
          const { products } = staticFixtures.productResult;

          storefrontAssistantPage.interceptPromptWithReplies([
            streamReply(productStreamEvents()),
            streamReply(
              storefrontAssistantPage.buildToolEvents('compare_products', staticFixtures.comparisonResult, {
                text: staticFixtures.productAnswerText,
              })
            ),
          ]);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.products);
          cy.wait('@sfaPrompt');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.selectProductForComparison(0);

          storefrontAssistantPage.getCompareTray().should('be.visible');
          storefrontAssistantPage
            .getCompareTrayCount()
            .should(haveTrimmedText(storefrontAssistantPage.getCompareTrayCountText(1)));
          storefrontAssistantPage.getCompareTraySubmit().should('be.disabled');

          storefrontAssistantPage.selectProductForComparison(1);

          storefrontAssistantPage
            .getCompareTrayCount()
            .should(haveTrimmedText(storefrontAssistantPage.getCompareTrayCountText(products.length)));
          storefrontAssistantPage.getCompareTrayChips().should('have.length', products.length);
          storefrontAssistantPage.getCompareTraySubmit().should('be.enabled');

          storefrontAssistantPage.submitComparison();

          waitForPromptBody().its('message').should('eq', storefrontAssistantPage.getCompareMessage(products));
          storefrontAssistantPage.getCompareTray().should('not.be.visible');
          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage
            .getComparisonCardTitle()
            .should(haveTrimmedText(storefrontAssistantPage.getComparisonTitleText()));
          storefrontAssistantPage
            .getComparisonCardCount()
            .should(haveTrimmedText(storefrontAssistantPage.getComparisonCountText(products.length)));
          storefrontAssistantPage.getComparisonCardProducts().should('have.length', products.length);
          storefrontAssistantPage.getComparisonLink().should('not.be.visible').and('not.have.attr', 'href');

          storefrontAssistantPage.openComparisonView();

          storefrontAssistantPage.getComparisonView().should('be.visible');
          storefrontAssistantPage.getPanelScroller().should('not.be.visible');
          storefrontAssistantPage.getPanelFooter().should('not.be.visible');
          storefrontAssistantPage.getComparisonHeadCells().should('have.length', products.length);
          storefrontAssistantPage
            .getComparisonRow(staticFixtures.comparisonDifferentAttribute)
            .should('have.attr', storefrontAssistantPage.getDifferentAttributeName());

          storefrontAssistantPage.toggleDifferencesOnly();

          storefrontAssistantPage
            .getComparisonView()
            .should('have.attr', storefrontAssistantPage.getDifferencesOnlyAttributeName());
          storefrontAssistantPage.getComparisonRow(staticFixtures.comparisonSameAttribute).should('not.be.visible');
          storefrontAssistantPage.getComparisonRow(staticFixtures.comparisonDifferentAttribute).should('be.visible');

          storefrontAssistantPage.closeComparisonView();

          storefrontAssistantPage.getComparisonView().should('not.be.visible');
          storefrontAssistantPage.getPanelScroller().should('be.visible');
        }
      );

      it(
        'an offer_choices result shows the question with answer chips, and a chip tap sends it and locks the row',
        { tags: ['@demo-smoke'] },
        (): void => {
          const { question, choices } = staticFixtures.choicesResult;

          storefrontAssistantPage.interceptPromptWithReplies([
            streamReply(storefrontAssistantPage.buildToolEvents('offer_choices', staticFixtures.choicesResult)),
            streamReply(staticFixtures.streams.text),
          ]);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.defaultPrompts[0]);
          cy.wait('@sfaPrompt');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.getChoiceQuestion().should(haveTrimmedText(question));
          storefrontAssistantPage.getChoiceChips().should('have.length', choices.length);
          choices.forEach((choice, index): void => {
            storefrontAssistantPage.getChoiceChips().eq(index).should(haveTrimmedText(choice));
          });

          storefrontAssistantPage.clickChoice(choices[1]);

          waitForPromptBody().its('message').should('eq', choices[1]);
          storefrontAssistantPage.getChoiceChip(choices[1]).should('have.attr', 'aria-pressed', 'true');
          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage.getChoiceChips().each(($chip): void => {
            expect($chip).to.be.disabled;
          });
        }
      );

      it(
        'a display_setup result shows the setup cards with the total against the budget',
        { tags: ['@demo-smoke'] },
        (): void => {
          const { products, totalFormatted, budgetFormatted } = staticFixtures.setupResult;

          storefrontAssistantPage.interceptPromptWithStream(
            storefrontAssistantPage.buildToolEvents('display_setup', staticFixtures.setupResult)
          );

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.products);
          cy.wait('@sfaPrompt');

          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage.getProductCards().should('have.length', products.length);
          storefrontAssistantPage
            .getSetupTotal()
            .should(haveTrimmedText(storefrontAssistantPage.getSetupTotalText(totalFormatted, budgetFormatted)));
        }
      );

      it(
        'a streamed error event shows its own text with Retry, and Retry re-sends the same prompt without a new user bubble',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithReplies([
            streamReply(staticFixtures.streams.error),
            streamReply(staticFixtures.streams.text),
          ]);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);

          waitForPromptBody().then((firstBody): void => {
            storefrontAssistantPage
              .getErrorMessages()
              .should('have.length', 1)
              .and('contain.text', staticFixtures.streamErrorText)
              .and('not.contain.text', storefrontAssistantPage.getGenericErrorText());
            storefrontAssistantPage.getRetryButton().should('be.visible');
            assertTurnState(TURN_STATE.error);
            storefrontAssistantPage.getMessageActions().should('not.exist');
            storefrontAssistantPage
              .readSessionStorage()
              .then((session) => session.conversationReference ?? null)
              .should('be.null');

            storefrontAssistantPage.clickRetry();

            waitForPromptBody().then((secondBody): void => {
              expect(secondBody.message).to.eq(firstBody.message);
              expect(secondBody.conversationReference).to.eq(firstBody.conversationReference);
            });
          });

          assertPromptCount(2);
          storefrontAssistantPage.getUserMessages().should('have.length', 1);
          storefrontAssistantPage.getErrorMessages().should('not.exist');
          storefrontAssistantPage.getRetryButton().should('not.exist');
          storefrontAssistantPage.getLastAnswer().should(haveTrimmedText(staticFixtures.textAnswer.plainText));
        }
      );

      [
        {
          description: 'an HTTP 503 response',
          buildReply: (): Record<string, unknown> => ({
            statusCode: 503,
            body: { error: staticFixtures.transportFailureError },
          }),
          allowFailure: storefrontAssistantPage.allowChatTurnFailure,
        },
        {
          description: 'an HTTP 200 response that is not an event stream',
          buildReply: (): Record<string, unknown> => ({
            statusCode: 200,
            body: { error: staticFixtures.transportFailureError },
          }),
          allowFailure: storefrontAssistantPage.allowChatTurnFailure,
        },
        {
          description: 'a stream cut before its finish event',
          buildReply: (): Record<string, unknown> =>
            storefrontAssistantPage.buildStreamReply(staticFixtures.streams.cut, { isTerminated: false }),
          allowFailure: storefrontAssistantPage.allowCutStreamFailure,
        },
      ].forEach(({ description, buildReply, allowFailure }): void => {
        it(`${description} shows the generic error with Retry`, { tags: ['@demo-smoke'] }, (): void => {
          allowFailure();
          storefrontAssistantPage.interceptPromptWithReplies([buildReply()]);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);
          cy.wait('@sfaPrompt');

          storefrontAssistantPage
            .getErrorMessages()
            .last()
            .should('contain.text', storefrontAssistantPage.getGenericErrorText())
            .and('not.contain.text', staticFixtures.transportFailureError);
          storefrontAssistantPage.getRetryButton().should('be.visible');
          storefrontAssistantPage.getInput().should('be.enabled');
        });
      });

      it(
        'a denied tool shows the product-information notice, and the rest of the answer still renders',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.deniedTool);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.products);
          cy.wait('@sfaPrompt');

          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage
            .getErrorMessages()
            .should('contain.text', storefrontAssistantPage.getToolDeniedText());
          storefrontAssistantPage.getLastAnswer().should(haveTrimmedText(staticFixtures.deniedToolAnswerText));
        }
      );

      it(
        'the answer markdown renders lists, tables and links and strips script and event-handler payloads',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.markdown);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);
          cy.wait('@sfaPrompt');

          assertTurnState(TURN_STATE.done);
          storefrontAssistantPage.getLastAnswerListItems().should('have.length', 2);
          storefrontAssistantPage.getLastAnswerTables().should('have.length', 1);
          storefrontAssistantPage.getLastAnswerLinks().should('have.length', 1);
          storefrontAssistantPage.getLastAnswerUnsafeMarkup().should('not.exist');
          storefrontAssistantPage.readHasWindowProperty(staticFixtures.xssWindowKey).should('eq', false);
        }
      );

      it(
        'on a product page the context chip shows the product, product prompts are filled, a prompt sends the product context, and a removed chip can be attached again',
        { tags: ['@demo-smoke'] },
        (): void => {
          const { product } = staticFixtures;
          const expectedPrompts = staticFixtures.productPrompts.map((prompt) =>
            storefrontAssistantPage.getProductPromptText(prompt, product.name)
          );
          const expectedPageContext = {
            pageType: 'product',
            productName: product.name,
            productSku: product.abstractSku,
          };

          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);

          storefrontAssistantPage.visitWithChat(product.path);
          storefrontAssistantPage.openPanel();

          storefrontAssistantPage.getPageContextLabel().should(haveTrimmedText(product.name));
          storefrontAssistantPage
            .getPageContextChip()
            .should('have.attr', storefrontAssistantPage.getAttachedAttributeName());
          storefrontAssistantPage.getSuggestedPrompts().should('have.length', expectedPrompts.length);
          expectedPrompts.forEach((prompt, index): void => {
            storefrontAssistantPage.getSuggestedPrompts().eq(index).should(haveTrimmedText(prompt));
          });

          storefrontAssistantPage.clickSuggestedPrompt(expectedPrompts[1]);

          waitForPromptBody().its('pageContext').should('deep.eq', expectedPageContext);
          storefrontAssistantPage.getInput().should('have.value', '');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.removePageContext();

          storefrontAssistantPage
            .getPageContextChip()
            .should('not.have.attr', storefrontAssistantPage.getAttachedAttributeName());
          storefrontAssistantPage.getPageContextAttachButton().should('be.visible');
          storefrontAssistantPage.getPageContextRemoveButton().should('not.be.visible');

          storefrontAssistantPage.sendMessage(staticFixtures.messages.pageContextFollowUp);

          waitForPromptBody().should('not.have.property', 'pageContext');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.attachPageContext();

          storefrontAssistantPage
            .getPageContextChip()
            .should('have.attr', storefrontAssistantPage.getAttachedAttributeName());

          storefrontAssistantPage.sendMessage(staticFixtures.messages.pageContextFollowUp);

          waitForPromptBody().its('pageContext').should('deep.eq', expectedPageContext);
        }
      );

      it(
        'category, search and cart pages show the matching context chip, prompt group and request context',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);

          staticFixtures.pageContexts.forEach(({ description, path, label, pageContext, firstPrompt }): void => {
            cy.log(description);
            storefrontAssistantPage.visitWithChat(path);
            storefrontAssistantPage.openPanel();

            if (label === null) {
              storefrontAssistantPage.getPageContextChip().should('not.be.visible');
            } else {
              storefrontAssistantPage.getPageContextLabel().should('be.visible').and(haveTrimmedText(label));
            }

            storefrontAssistantPage.getSuggestedPrompts().first().should(haveTrimmedText(firstPrompt));

            storefrontAssistantPage.clickFirstSuggestedPrompt();

            waitForPromptBody().then((body): void => {
              if (pageContext === null) {
                expect(body, description).not.to.have.property('pageContext');

                return;
              }

              expect(body.pageContext, description).to.deep.eq(pageContext);
            });
          });
        }
      );

      it(
        'attached files show as chips, a removed chip is not sent, and the prompt carries the remaining files as base64 with pills in the user bubble',
        { tags: ['@demo-smoke'] },
        (): void => {
          const { attachmentFiles, extraAttachmentFile } = staticFixtures;

          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);

          visitHome();
          storefrontAssistantPage.openPanel();

          storefrontAssistantPage.attachFiles(attachmentFiles.map((file) => file.path));

          storefrontAssistantPage.getAttachmentChips().should('have.length', attachmentFiles.length);

          storefrontAssistantPage.attachFiles([extraAttachmentFile.path]);

          storefrontAssistantPage.getAttachmentChips().should('have.length', attachmentFiles.length + 1);

          storefrontAssistantPage.removeAttachmentChip(extraAttachmentFile.name);

          storefrontAssistantPage.getAttachmentChips().should('have.length', attachmentFiles.length);
          attachmentFiles.forEach((file, index): void => {
            storefrontAssistantPage.getAttachmentChipNames().eq(index).should(haveTrimmedText(file.name));
          });

          storefrontAssistantPage.sendMessage(staticFixtures.messages.attachment);

          waitForPromptBody().then((body): void => {
            const attachments = body.attachments as Array<Record<string, unknown>>;

            expect(attachments).to.have.length(attachmentFiles.length);
            attachmentFiles.forEach((file, index): void => {
              expect(attachments[index].name).to.eq(file.name);
              expect(attachments[index].mediaType).to.eq(file.mediaType);
              expect(String(attachments[index].content))
                .to.have.length.greaterThan(0)
                .and.not.match(/^data:/);
            });
          });

          storefrontAssistantPage.getAttachmentPills().should('have.length', attachmentFiles.length);
          attachmentFiles.forEach((file, index): void => {
            storefrontAssistantPage.getAttachmentPills().eq(index).should('contain.text', file.name);
          });
          storefrontAssistantPage.getAttachmentChips().should('not.exist');
        }
      );

      it(
        'the client rejects an unsupported type, a file above the size limit and a sixth file with a readable notice and no chip',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);

          staticFixtures.clientRejections.forEach(({ description, files, notice, acceptedCount }): void => {
            cy.log(description);
            visitHome();
            storefrontAssistantPage.openPanel();

            storefrontAssistantPage.attachFiles(
              files.map(({ fileName, mimeType, sizeBytes }) =>
                storefrontAssistantPage.buildGeneratedFile(fileName, mimeType, sizeBytes)
              )
            );

            storefrontAssistantPage.getAttachmentNoticeReason().should('be.visible').and(haveTrimmedText(notice));
            storefrontAssistantPage
              .getAttachmentNoticeFileName()
              .should(haveTrimmedText(files[files.length - 1].fileName));
            storefrontAssistantPage.getAttachmentChips().should('have.length', acceptedCount);
          });

          assertPromptCount(0);
        }
      );

      it(
        'a finished conversation persists across navigation, reopens the panel and replays the messages with product cards',
        { tags: ['@demo-smoke'] },
        (): void => {
          const reference = staticFixtures.stubbedConversationReferences.products;

          storefrontAssistantPage.interceptPromptWithStream(productStreamEvents());

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.sendMessage(staticFixtures.messages.products);
          cy.wait('@sfaPrompt');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.readSessionStorage().then((session): void => {
            expect(session.conversationReference).to.eq(reference);
            expect(session.isOpen).to.eq(true);
          });

          storefrontAssistantPage.interceptConversationMessagesWith(reference, [
            { role: 'user', content: staticFixtures.messages.products },
            {
              role: 'tool_result',
              content: '',
              toolName: 'display_products',
              toolResult: staticFixtures.productResult,
            },
            { role: 'ai', content: staticFixtures.productAnswerText },
          ]);

          storefrontAssistantPage.visitWithChat(staticFixtures.product.path, { keepChatStorage: true });

          cy.wait('@sfaMessages').its('request.url').should('contain', `conversationReference=${reference}`);
          storefrontAssistantPage.getChat().should('have.attr', storefrontAssistantPage.getOpenAttributeName());
          storefrontAssistantPage.getUserMessages().should('have.length', 1);
          storefrontAssistantPage.getProductCards().should('have.length', staticFixtures.productResult.products.length);
          storefrontAssistantPage.getAssistantMessages().should('have.length', 1);
          storefrontAssistantPage.getWelcomeZone().should('not.be.visible');
          storefrontAssistantPage.getCopyButtons().last().should('be.visible');
          storefrontAssistantPage.getRegenerateButtons().should('not.be.visible');
          storefrontAssistantPage.getMessageTimes().should('not.be.visible');
        }
      );

      it(
        'New conversation clears the transcript, shows the welcome again, and resets the stored reference and the agent',
        { tags: ['@demo-smoke'] },
        (): void => {
          storefrontAssistantPage.interceptPromptWithStream(staticFixtures.streams.text);
          storefrontAssistantPage.interceptConversationMessages();

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.selectAgent(staticFixtures.agents[1].value);
          storefrontAssistantPage.sendMessage(staticFixtures.messages.simple);
          cy.wait('@sfaPrompt');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage.startNewConversation();

          storefrontAssistantPage.getTranscript().children().should('have.length', 0);
          storefrontAssistantPage.getWelcomeZone().should('be.visible');
          storefrontAssistantPage.getSuggestedPrompts().should('have.length', staticFixtures.defaultPrompts.length);
          storefrontAssistantPage
            .readSessionStorage()
            .then((session) => session.conversationReference ?? null)
            .should('be.null');
          storefrontAssistantPage.getAgentLabel().should(haveTrimmedText(staticFixtures.agents[0].label));
          storefrontAssistantPage.getInput().should('have.focus');
          storefrontAssistantPage.getAlias('sfaMessages.all').should('have.length', 0);
        }
      );

      it(
        'the history view lists conversations with names and times, and opening one loads its messages and marks it current',
        { tags: ['@demo-smoke'] },
        (): void => {
          const [firstConversation] = staticFixtures.conversations;

          storefrontAssistantPage.interceptConversationStore(staticFixtures.conversations);
          storefrontAssistantPage.interceptConversationMessagesWith(
            firstConversation.conversationReference,
            staticFixtures.historyMessages
          );

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.openHistory();
          cy.wait('@sfaConversations');

          storefrontAssistantPage.getHistories().should('be.visible');
          storefrontAssistantPage.getPanelScroller().should('not.be.visible');
          storefrontAssistantPage.getPanelFooter().should('not.be.visible');
          storefrontAssistantPage
            .getHistoriesCount()
            .should(haveTrimmedText(String(staticFixtures.conversations.length)));
          staticFixtures.conversations.forEach(({ name }, index): void => {
            storefrontAssistantPage
              .getHistoryItemNames()
              .eq(index)
              .should(haveTrimmedText(name || storefrontAssistantPage.getUntitledConversationText()));
            storefrontAssistantPage.getHistoryItemTimes().eq(index).invoke('text').should('not.be.empty');
          });

          storefrontAssistantPage.openHistoryItem(0);

          cy.wait('@sfaMessages')
            .its('request.url')
            .should('contain', `conversationReference=${firstConversation.conversationReference}`);
          storefrontAssistantPage.getHistories().should('not.be.visible');
          storefrontAssistantPage.getUserMessages().should('have.length', 1);
          storefrontAssistantPage.getAssistantMessages().should('have.length', 1);
          storefrontAssistantPage
            .readSessionStorage()
            .its('conversationReference')
            .should('eq', firstConversation.conversationReference);

          storefrontAssistantPage.openHistory();
          cy.wait('@sfaConversations');

          storefrontAssistantPage.getHistoryItems().first().should('have.attr', 'aria-current', 'true');
          storefrontAssistantPage
            .getHistoryItemCurrent(0)
            .should('be.visible')
            .and(haveTrimmedText(storefrontAssistantPage.getCurrentBadgeText()));
        }
      );

      it(
        'deleting one conversation and deleting the selected conversations send the references, remove the rows and show the empty state, and a failed list shows the load error',
        { tags: ['@demo-smoke'] },
        (): void => {
          const [firstConversation, secondConversation] = staticFixtures.conversations;

          storefrontAssistantPage.interceptConversationStore(staticFixtures.conversations);

          visitHome();
          storefrontAssistantPage.openPanel();
          storefrontAssistantPage.openHistory();
          cy.wait('@sfaConversations');

          storefrontAssistantPage.stubConfirm(false);
          storefrontAssistantPage.deleteHistoryItem(0);

          storefrontAssistantPage.getAlias('confirmDialog').should('have.been.calledOnce');
          storefrontAssistantPage.getAlias('sfaDelete.all').should('have.length', 0);
          storefrontAssistantPage.getHistoryItems().should('have.length', staticFixtures.conversations.length);

          storefrontAssistantPage.stubConfirm(true);
          storefrontAssistantPage.deleteHistoryItem(0);

          cy.wait('@sfaDelete')
            .its('request.body')
            .then((body) => storefrontAssistantPage.readBody(body))
            .should('deep.eq', { conversationReferences: [firstConversation.conversationReference] });
          storefrontAssistantPage.getHistoryItems().should('have.length', staticFixtures.conversations.length - 1);

          storefrontAssistantPage.startHistorySelection();
          storefrontAssistantPage.selectAllHistoryItems();
          storefrontAssistantPage.deleteSelectedHistoryItems();

          cy.wait('@sfaDelete')
            .its('request.body')
            .then((body) => storefrontAssistantPage.readBody(body))
            .should('deep.eq', { conversationReferences: [secondConversation.conversationReference] });
          storefrontAssistantPage
            .getHistoriesEmpty()
            .should('be.visible')
            .and(haveTrimmedText(storefrontAssistantPage.getHistoriesEmptyText()));
          storefrontAssistantPage.getHistoriesSelect().should('not.be.visible');

          storefrontAssistantPage.startNewChatFromHistory();

          storefrontAssistantPage.getHistories().should('not.be.visible');
          storefrontAssistantPage.getWelcomeZone().should('be.visible');

          storefrontAssistantPage.allowConversationListFailure();
          storefrontAssistantPage.interceptConversationListFailure();
          storefrontAssistantPage.openHistory();
          cy.wait('@sfaConversations');

          storefrontAssistantPage.getHistories().should('not.be.visible');
          storefrontAssistantPage
            .getErrorMessages()
            .last()
            .should(haveTrimmedText(storefrontAssistantPage.getHistoriesLoadErrorText()));
        }
      );

      it(
        'the prompt endpoint rejects bad security and bad payloads with the documented status and translated text',
        { tags: ['@demo-smoke'] },
        (): void => {
          runContractCases(staticFixtures.promptContractCases);
        }
      );

      it(
        'the conversation endpoints answer the documented shapes and refuse foreign or invalid references',
        { tags: ['@demo-smoke'] },
        (): void => {
          runContractCases(staticFixtures.conversationContractCases);
        }
      );

      it(
        'the German storefront shows the assistant texts in German, and the server texts follow the request locale',
        { tags: ['@demo-smoke'] },
        (): void => {
          const { germanTexts, germanStoreLocalePath } = staticFixtures;

          storefrontAssistantPage.visitWithChat(germanStoreLocalePath);

          storefrontAssistantPage.getTriggerText().should(haveTrimmedText(germanTexts.trigger));

          storefrontAssistantPage.openPanel();

          storefrontAssistantPage.getPanelTitle().should(haveTrimmedText(germanTexts.trigger));
          storefrontAssistantPage.getWelcomeText().should(haveTrimmedText(germanTexts.greeting));
          storefrontAssistantPage.getInput().should('have.attr', 'placeholder', germanTexts.placeholder);
          storefrontAssistantPage.getHint().should(haveTrimmedText(germanTexts.hint));
          storefrontAssistantPage.getDisclosure().should(haveTrimmedText(germanTexts.disclosure));

          storefrontAssistantPage.openMoreMenu();

          [germanTexts.historyMenuItem, germanTexts.newConversationMenuItem].forEach((label): void => {
            storefrontAssistantPage.getMenuItems().filter(`:contains("${label}")`).should('have.length', 1);
          });

          storefrontAssistantPage.pressEscapeOnFocusedElement();
          storefrontAssistantPage.openAgentMenu();

          germanTexts.agentLabels.forEach((label, index): void => {
            storefrontAssistantPage.getAgentOptions().eq(index).should('contain.text', label);
          });

          storefrontAssistantPage.readPromptUrl().then((promptUrl): void => {
            expect(promptUrl).to.eq(storefrontAssistantPage.getPromptPath(germanStoreLocalePath));

            storefrontAssistantPage.readCsrfToken().then((csrfToken): void => {
              storefrontAssistantPage
                .requestEndpoint({
                  method: 'POST',
                  path: promptUrl,
                  body: { ...staticFixtures.contractPayload, message: '   ' },
                  csrfToken,
                })
                .then((response): void => {
                  expect(response.status).to.eq(400);
                  expect(response.body.error).to.eq(germanTexts.emptyMessageError);
                });
            });
          });
        }
      );

      it(
        'on a 390 px viewport the trigger fits without a horizontal scroll, the panel opens full width without docking, and the carousel arrows show',
        { tags: ['@demo-smoke'] },
        (): void => {
          cy.viewport(staticFixtures.mobileViewport.width, staticFixtures.mobileViewport.height);
          storefrontAssistantPage.interceptPromptWithStream(
            storefrontAssistantPage.buildToolEvents('display_products', staticFixtures.carouselResult)
          );

          visitHome();

          storefrontAssistantPage.getTrigger().should('be.visible');
          storefrontAssistantPage.readDocumentScrollOverflow().should('be.at.most', 0);

          storefrontAssistantPage.openPanel();

          storefrontAssistantPage.readLayoutViewportWidth().then((layoutWidth): void => {
            storefrontAssistantPage.getPanel().invoke('outerWidth').should('eq', layoutWidth);
          });
          storefrontAssistantPage.getHtml().should('not.have.attr', storefrontAssistantPage.getDockedAttributeName());
          storefrontAssistantPage.getBody().invoke('css', 'padding-right').should('eq', '0px');

          storefrontAssistantPage.sendMessage(staticFixtures.messages.products);
          cy.wait('@sfaPrompt');
          assertTurnState(TURN_STATE.done);

          storefrontAssistantPage
            .getCarousel()
            .should('have.attr', storefrontAssistantPage.getScrollableAttributeName());
          storefrontAssistantPage.getCarouselNext().should('be.visible');

          storefrontAssistantPage.clickCarouselNext();

          storefrontAssistantPage.getCarouselPrevious().should('be.enabled');
        }
      );

      describe('with the Product Discovery agent switched off', (): void => {
        after((): void => {
          setAssistantSettings([
            { settingKey: storefrontAssistantPage.getProductDiscoveryAgentSettingKey(), isEnabled: true },
          ]);
        });

        it(
          'the storefront renders no chat, and a prompt with a valid token ends in the not-available stream error without an AI call',
          { tags: ['@demo-smoke'] },
          (): void => {
            visitHome();

            storefrontAssistantPage.readCsrfToken().then((csrfToken): void => {
              setAssistantSettings([
                { settingKey: storefrontAssistantPage.getProductDiscoveryAgentSettingKey(), isEnabled: false },
              ]);
              loginCustomer();

              storefrontAssistantPage.visitWithoutChat(staticFixtures.storeLocalePath);

              storefrontAssistantPage.getChat().should('not.exist');
              storefrontAssistantPage.getTrigger().should('have.attr', 'hidden');

              storefrontAssistantPage
                .requestEndpoint({
                  method: 'POST',
                  path: storefrontAssistantPage.getPromptPath(staticFixtures.storeLocalePath),
                  body: staticFixtures.contractPayload,
                  csrfToken,
                })
                .then((response): void => {
                  expect(response.status).to.eq(200);
                  expect(response.headers['content-type']).to.contain(
                    storefrontAssistantPage.getEventStreamContentType()
                  );
                  expect(String(response.body)).to.contain(storefrontAssistantPage.getNoAgentErrorText());
                });
            });
          }
        );
      });

      describe('with the assistant switched off', (): void => {
        before((): void => {
          setAssistantSettings([{ settingKey: storefrontAssistantPage.getEnabledSettingKey(), isEnabled: false }]);
        });

        after((): void => {
          setAssistantSettings([{ settingKey: storefrontAssistantPage.getEnabledSettingKey(), isEnabled: true }]);
        });

        it(
          'the storefront renders no chat, and every assistant endpoint answers 404',
          { tags: ['@demo-smoke'] },
          (): void => {
            storefrontAssistantPage.visitWithoutChat(staticFixtures.storeLocalePath);

            storefrontAssistantPage.getChat().should('not.exist');
            storefrontAssistantPage.getTrigger().should('have.attr', 'hidden');

            staticFixtures.guestEndpoints.forEach(({ method, endpoint, query, body }): void => {
              storefrontAssistantPage
                .requestEndpoint({
                  method,
                  path: storefrontAssistantPage.getEndpointPath(staticFixtures.storeLocalePath, endpoint),
                  query,
                  body,
                })
                .then((response): void => {
                  expect(response.status, `${method} ${endpoint}`).to.eq(404);
                  expect(response.body, `${method} ${endpoint}`).to.deep.eq({});
                });
            });
          }
        );
      });

      describe('real AI provider flow (full, requires provider token)', { tags: ['@demo-full'] }, (): void => {
        const REAL_FLOW_TIMEOUT = 90000;

        const finishRealTurn = (): Cypress.Chainable =>
          cy
            .wait('@sfaRealPrompt', { timeout: REAL_FLOW_TIMEOUT, responseTimeout: REAL_FLOW_TIMEOUT })
            .then(() => waitForTurnEnd(REAL_FLOW_TIMEOUT))
            .then(($chat): void => {
              if ($chat.attr(storefrontAssistantPage.getTurnStateAttributeName()) !== TURN_STATE.error) {
                return;
              }

              storefrontAssistantPage.clickRetry();
              cy.wait('@sfaRealPrompt', { timeout: REAL_FLOW_TIMEOUT, responseTimeout: REAL_FLOW_TIMEOUT });
              waitForTurnEnd(REAL_FLOW_TIMEOUT);
            })
            .then(() => assertTurnState(TURN_STATE.done));

        const assertLatestTurnHasProductsOrText = (): Cypress.Chainable =>
          storefrontAssistantPage.readLatestTurnSummary().then((summary): void => {
            expect(
              summary.cardCount + summary.comparisonCount + summary.choiceCount > 0 || summary.text.length > 0,
              'the latest turn has product results or an answer text'
            ).to.eq(true);
          });

        const assertLatestCardsAreValid = (): void => {
          storefrontAssistantPage.getProductCards().each(($card, index): void => {
            storefrontAssistantPage.getProductCardName(index).invoke('text').invoke('trim').should('not.be.empty');
            storefrontAssistantPage
              .getProductCardPrice(index)
              .invoke('text')
              .should('match', storefrontAssistantPage.getPricePattern());
            storefrontAssistantPage
              .getProductCardView(index)
              .should('have.attr', 'href')
              .and('match', new RegExp(`^${staticFixtures.storeLocalePath}/`));
          });
        };

        const readPriceValue = (text: string): number => Number(text.replace(/[^\d.,]/g, '').replace(/,/g, ''));

        before((): void => {
          setAssistantVendor(staticFixtures.defaultVendor);
        });

        beforeEach((): void => {
          storefrontAssistantPage.interceptRealPrompt();
        });

        afterEach((): void => {
          storefrontAssistantPage.readCsrfTokenIfPresent().then((csrfToken): void => {
            if (csrfToken === '') {
              return;
            }

            storefrontAssistantPage.readSessionStorage().then((session): void => {
              if (!session.conversationReference) {
                return;
              }

              storefrontAssistantPage.requestEndpoint({
                method: 'DELETE',
                path: storefrontAssistantPage.getEndpointPath(staticFixtures.storeLocalePath, 'conversations'),
                body: { conversationReferences: [session.conversationReference] },
                csrfToken,
              });
            });
          });
        });

        it(
          'a real product question streams product cards with valid store links, Auto resolves the answering agent, and a card link opens the product page with the same price',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.discovery);

            finishRealTurn();

            storefrontAssistantPage.getAlias('sfaRealPrompt').then((interception): void => {
              expect(interception.response?.statusCode).to.eq(200);
              expect(interception.response?.headers['content-type']).to.contain(
                storefrontAssistantPage.getEventStreamContentType()
              );
              expect(readChatRequestBody(interception.request.body).selectedAgent).to.eq(null);
            });
            storefrontAssistantPage.getProductCards().should('have.length.at.least', 1);
            assertLatestCardsAreValid();
            storefrontAssistantPage.getLastAnswer().invoke('text').invoke('trim').should('not.be.empty');
            storefrontAssistantPage.getAgentLabel().should(haveTrimmedText(staticFixtures.agents[1].label));
            storefrontAssistantPage.getCopyButtons().last().should('be.visible');
            storefrontAssistantPage.getRegenerateButtons().last().should('be.visible');

            storefrontAssistantPage
              .getProductCardView(0)
              .invoke('attr', 'href')
              .then((href): void => {
                storefrontAssistantPage
                  .getProductCardPrice(0)
                  .invoke('text')
                  .then((cardPrice): void => {
                    storefrontAssistantPage.interceptConversationMessages();

                    storefrontAssistantPage.visitWithChat(String(href), { keepChatStorage: true });

                    cy.wait('@sfaMessages').its('response.statusCode').should('eq', 200);
                    storefrontAssistantPage.getProductPageName().should('exist');
                    storefrontAssistantPage
                      .getUserMessages()
                      .first()
                      .should('contain.text', staticFixtures.realPrompts.discovery);
                    storefrontAssistantPage
                      .getProductPagePrice()
                      .first()
                      .invoke('attr', 'content')
                      .then((pagePrice): void => {
                        expect(readPriceValue(cardPrice), 'the chat card price equals the product page price').to.eq(
                          Number(pagePrice)
                        );
                      });
                  });
              });
          }
        );

        it(
          'two real cards compare into a comparison table, and a refinement chip sends a filtered follow-up with a valid result',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.discovery);
            finishRealTurn();

            storefrontAssistantPage.getProductCards().should('have.length.at.least', 1);
            storefrontAssistantPage.readLatestTurnSummary().then(({ cardCount }): void => {
              if (cardCount >= 2) {
                storefrontAssistantPage.selectProductForComparison(0);
                storefrontAssistantPage.selectProductForComparison(1);
                storefrontAssistantPage.submitComparison();
              } else {
                storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.compareFollowUp);
              }
            });
            finishRealTurn();

            storefrontAssistantPage
              .getAlias('sfaRealPrompt')
              .its('request.body')
              .then((body) => readChatRequestBody(body).message)
              .should('satisfy', (message: string) =>
                [storefrontAssistantPage.getCompareMessagePrefix(), staticFixtures.realPrompts.compareFollowUp].some(
                  (expected) => message.startsWith(expected)
                )
              );
            storefrontAssistantPage.getComparisonCardProducts().should('have.length.at.least', 2);
            storefrontAssistantPage.getComparisonLink().should('not.be.visible').and('not.have.attr', 'href');

            storefrontAssistantPage.openComparisonView();

            storefrontAssistantPage
              .getComparisonRows()
              .should('have.length.at.least', 1)
              .then(($rows): void => {
                storefrontAssistantPage.toggleDifferencesOnly();
                storefrontAssistantPage
                  .getComparisonRows()
                  .filter(':visible')
                  .its('length')
                  .should('be.at.most', $rows.length);
              });

            storefrontAssistantPage.closeComparisonView();

            storefrontAssistantPage.getRefinementChips().then(($chips): void => {
              if ($chips.length === 0) {
                cy.log('the first result has no refinement chips');

                return;
              }

              storefrontAssistantPage.clickRefinementChip(0);
              finishRealTurn();

              storefrontAssistantPage
                .getAlias('sfaRealPrompt')
                .its('request.body')
                .then((body) => String(readChatRequestBody(body).message))
                .should('match', storefrontAssistantPage.getRefinementMessagePattern());
              storefrontAssistantPage
                .getUserMessages()
                .last()
                .invoke('text')
                .invoke('trim')
                .should('not.match', storefrontAssistantPage.getRefinementHintPattern());
              assertLatestTurnHasProductsOrText();
            });
          }
        );

        it(
          'on a product page, "Show me similar products" sends the product context and gets products or an answer',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            storefrontAssistantPage.visitWithChat(staticFixtures.product.path);
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.clickSuggestedPrompt(staticFixtures.productPrompts[1]);
            finishRealTurn();

            storefrontAssistantPage
              .getAlias('sfaRealPrompt')
              .its('request.body')
              .then((body) => readChatRequestBody(body).pageContext as Record<string, unknown>)
              .should('include', { pageType: 'product', productSku: staticFixtures.product.abstractSku });
            assertLatestTurnHasProductsOrText();
          }
        );

        it(
          'on a category page, the category prompt sends the category context and gets products or an answer',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            storefrontAssistantPage.visitWithChat(staticFixtures.pageContexts[0].path);
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.clickFirstSuggestedPrompt();
            finishRealTurn();

            storefrontAssistantPage
              .getAlias('sfaRealPrompt')
              .its('request.body')
              .then((body) => readChatRequestBody(body).pageContext as Record<string, unknown>)
              .should('include', { pageType: 'category' });
            assertLatestTurnHasProductsOrText();
          }
        );

        it(
          'a vague gift request gets clarifying choices or products, and a choice tap continues the conversation',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.clickSuggestedPrompt(staticFixtures.defaultPrompts[0]);
            finishRealTurn();

            storefrontAssistantPage.readLatestTurnSummary().then(({ choiceCount }): void => {
              if (choiceCount === 0) {
                assertLatestTurnHasProductsOrText();

                return;
              }

              expect(choiceCount).to.be.within(2, 6);

              storefrontAssistantPage
                .getChoiceChips()
                .last()
                .invoke('text')
                .invoke('trim')
                .then((choice): void => {
                  storefrontAssistantPage.clickChoice(choice);
                  finishRealTurn();

                  storefrontAssistantPage
                    .getAlias('sfaRealPrompt')
                    .its('request.body')
                    .then((body) => readChatRequestBody(body).message)
                    .should('eq', choice);
                  storefrontAssistantPage.getChoiceChip(choice).should('have.attr', 'aria-pressed', 'true');
                  assertLatestTurnHasProductsOrText();
                });
            });
          }
        );

        it(
          'a budget setup request shows setup cards with a total against the budget, or products or an answer',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.setup);
            finishRealTurn();

            storefrontAssistantPage.readLatestTurnSummary().then(({ setupTotalCount, cardCount }): void => {
              if (setupTotalCount === 0) {
                assertLatestTurnHasProductsOrText();

                return;
              }

              expect(cardCount).to.be.at.least(2);
              storefrontAssistantPage
                .getSetupTotal()
                .last()
                .invoke('text')
                .invoke('trim')
                .should('match', storefrontAssistantPage.getSetupTotalPattern());
            });
          }
        );

        it(
          'a shop-policy question gets a text answer without products, and Regenerate replaces the answer in the same turn',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.policy);
            finishRealTurn();

            storefrontAssistantPage.readLatestTurnSummary().then(({ text, cardCount }): void => {
              expect(text).not.to.eq('');
              expect(cardCount).to.eq(0);
            });

            storefrontAssistantPage.clickRegenerate();
            finishRealTurn();

            storefrontAssistantPage
              .getAlias('sfaRealPrompt')
              .its('request.body')
              .then((body) => readChatRequestBody(body))
              .should('include', { regenerate: true, message: staticFixtures.realPrompts.policy });
            storefrontAssistantPage
              .getUserMessages()
              .filter(`:contains("${staticFixtures.realPrompts.policy}")`)
              .should('have.length', 1);
            storefrontAssistantPage.getLastAnswer().invoke('text').invoke('trim').should('not.be.empty');
          }
        );

        it(
          'a real conversation appears in the history under its first message, reloads from the server, and is deleted from the history',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            const message = `${staticFixtures.realPrompts.historyPrefix} ${Date.now()}`;
            const historyName = message.slice(0, staticFixtures.historyNameLength);

            storefrontAssistantPage.interceptConversations();
            storefrontAssistantPage.interceptDeleteConversations();

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.openHistory();

            cy.wait('@sfaConversations')
              .its('response.body.conversations.length')
              .then((startCount): void => {
                storefrontAssistantPage.closeHistory();
                storefrontAssistantPage.sendMessage(message);
                finishRealTurn();

                storefrontAssistantPage.interceptConversationMessages();
                visitHome({ keepChatStorage: true });

                cy.wait('@sfaMessages').its('response.statusCode').should('eq', 200);
                storefrontAssistantPage.getUserMessages().first().should('contain.text', message);
                assertLatestTurnHasProductsOrText();

                storefrontAssistantPage.openHistory();
                cy.wait('@sfaConversations');
                storefrontAssistantPage.getHistoryItemByName(historyName).should('exist');

                storefrontAssistantPage.stubConfirm(true);
                storefrontAssistantPage.deleteHistoryItemByName(historyName);

                cy.wait('@sfaDelete').its('response.body.deletedCount').should('eq', 1);
                storefrontAssistantPage.getHistoryItems().should('have.length', Number(startCount));
              });
          }
        );

        it(
          'a product image with a question carries the image and gets products or an answer',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.attachFiles([staticFixtures.productImageFile.path]);
            storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.imageQuestion);
            finishRealTurn();

            storefrontAssistantPage
              .getAlias('sfaRealPrompt')
              .its('request.body')
              .then((body) => (readChatRequestBody(body).attachments as Array<Record<string, unknown>>)[0].mediaType)
              .should('eq', staticFixtures.productImageFile.mediaType);
            storefrontAssistantPage.getAttachmentPills().should('have.length', 1);
            assertLatestTurnHasProductsOrText();
          }
        );

        it(
          'a German question on the German storefront uses the German prompt endpoint and gets products or an answer',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            storefrontAssistantPage.visitWithChat(staticFixtures.germanStoreLocalePath);
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.german);
            finishRealTurn();

            storefrontAssistantPage
              .getAlias('sfaRealPrompt')
              .its('request.url')
              .should('contain', storefrontAssistantPage.getPromptPath(staticFixtures.germanStoreLocalePath));
            assertLatestTurnHasProductsOrText();
          }
        );

        it(
          'an off-topic question gets a short text answer and no product result',
          { tags: ['@demo-full'] },
          function (): void {
            skipUnlessAiProviderEnabled(this);

            visitHome();
            storefrontAssistantPage.openPanel();
            storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.offTopic);
            finishRealTurn();

            storefrontAssistantPage.readLatestTurnSummary().then(({ text, cardCount, comparisonCount }): void => {
              expect(text).not.to.eq('');
              expect(cardCount).to.eq(0);
              expect(comparisonCount).to.eq(0);
            });
          }
        );

        describe('other AI vendors', (): void => {
          const vendorsWithToken: Record<string, boolean> = {};

          before((): void => {
            loginAdmin();
            OTHER_VENDORS.forEach(({ vendor }): void => {
              aiConfigurationPage.hasApiToken(vendor).then((hasToken): void => {
                vendorsWithToken[vendor] = hasToken;
              });
            });
          });

          after((): void => {
            setAssistantVendor(staticFixtures.defaultVendor);
          });

          OTHER_VENDORS.forEach(({ vendor, auditMarker }): void => {
            it(
              `answers two turns with the ${vendor} vendor in a new conversation and writes a configuration-filterable audit row`,
              { tags: ['@demo-full'] },
              function (): void {
                skipUnlessAiProviderEnabled(this);

                if (!vendorsWithToken[vendor]) {
                  this.skip();
                }

                setAssistantVendor(vendor);
                loginCustomer();

                storefrontAssistantPage.visitWithChat(staticFixtures.pageContexts[0].path);
                storefrontAssistantPage.openPanel();
                storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.discovery);
                finishRealTurn();
                assertLatestTurnHasProductsOrText();

                storefrontAssistantPage.sendMessage(staticFixtures.realPrompts.compareFollowUp);
                finishRealTurn();
                assertLatestTurnHasProductsOrText();

                setAssistantVendor(staticFixtures.defaultVendor);

                auditLogsPage.assertNewestRowConfigurationIsFilterable(auditMarker);
              }
            );
          });
        });
      });
    });
  }
);
