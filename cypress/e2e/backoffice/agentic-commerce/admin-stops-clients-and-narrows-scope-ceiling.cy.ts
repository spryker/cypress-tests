import { ClientListPage, KillSwitchPage, ScopeCeilingPage } from '@pages/backoffice';
import { ConsentPage } from '@pages/yves';
import { UserLoginScenario } from '@scenarios/backoffice';
import { ClientAuthorizationScenario } from '@scenarios/yves';
import {
  blockAgenticCommerceClient,
  container,
  enableAgenticCommerce,
  exchangeAuthorizationCode,
  isAgenticCommerceCutReached,
  readPrincipal,
  registerAgenticCommerceClient,
  requestDynamicClientRegistration,
  setAgenticCommerceScopeCeiling,
} from '@utils';
import { AgenticCommerceClient, AgenticCommerceKillSwitchStaticFixtures, AgenticCommerceTokens } from '@interfaces/api';

describe(
  'admin-stops-clients-and-narrows-scope-ceiling',
  {
    tags: ['@backoffice', '@yves', '@api', '@agentic-commerce', '@agentic-commerce-cut-6a-2', 'agentic-commerce'],
  },
  (): void => {
    if (!isAgenticCommerceCutReached('6a-2')) {
      it.skip('skipped until the suite runs AgenticCommerce cut 6a-2', () => {});
      return;
    }

    const userLoginScenario = container.get(UserLoginScenario);
    const clientAuthorizationScenario = container.get(ClientAuthorizationScenario);
    const killSwitchPage = container.get(KillSwitchPage);
    const clientListPage = container.get(ClientListPage);
    const scopeCeilingPage = container.get(ScopeCeilingPage);
    const consentPage = container.get(ConsentPage);

    const ORDER_PLACE_SCOPE = 'order:place';

    let staticFixtures: AgenticCommerceKillSwitchStaticFixtures;
    let client: AgenticCommerceClient;
    let dynamicClient: AgenticCommerceClient;
    let tokens: AgenticCommerceTokens;

    const loginAsAdmin = (): void => {
      userLoginScenario.execute({
        username: staticFixtures.backofficeUser.username,
        password: staticFixtures.backofficeUser.password,
      });
    };

    before((): void => {
      ({ staticFixtures } = Cypress.env());
      registerAgenticCommerceClient('AdminStops', staticFixtures.redirectUri, staticFixtures.scope).then(
        (registeredClient) => {
          client = registeredClient;
          setAgenticCommerceScopeCeiling(client, staticFixtures.scopeCeiling.supportedScopes);
        }
      );

      cy.then(() => {
        clientAuthorizationScenario
          .execute({ client, email: staticFixtures.customer.email, password: staticFixtures.defaultPassword })
          .then(({ proofKey, response }) => {
            exchangeAuthorizationCode(client, String(response.code), proofKey).then((tokenResponse) => {
              tokens = tokenResponse.body;
            });
          });
      });
    });

    after((): void => {
      enableAgenticCommerce();
      loginAsAdmin();
      killSwitchPage.visit();
      killSwitchPage.getPageBody().then(($body) => {
        if ($body.text().includes(staticFixtures.killSwitch.texts.statusOff)) {
          killSwitchPage.switchOn(staticFixtures.killSwitch.enableReason);
        }
      });

      if (client) {
        blockAgenticCommerceClient(client);
      }

      if (dynamicClient) {
        blockAgenticCommerceClient(dynamicClient);
      }
    });

    it('switching delegated access off should be refused without a usable reason', (): void => {
      const { texts, tooShortReason } = staticFixtures.killSwitch;

      loginAsAdmin();
      killSwitchPage.visit();
      killSwitchPage.getForm().should('be.visible');

      killSwitchPage.switchOff('   ');
      killSwitchPage.getForm().should('contain', texts.reasonRequired);

      killSwitchPage.switchOff(tooShortReason);
      killSwitchPage.getForm().should('contain', texts.reasonTooShort);

      killSwitchPage.getPageBody().should('contain', texts.statusOn);
      cy.then(() => {
        readPrincipal(tokens.access_token).its('status').should('equal', 200);
      });
    });

    it('back office user should switch delegated access off with a reason and stop the client', (): void => {
      const { texts, disableReason } = staticFixtures.killSwitch;

      loginAsAdmin();
      killSwitchPage.visit();
      killSwitchPage.switchOff(disableReason);

      killSwitchPage.getFlashMessage().should('contain', texts.disabled);
      killSwitchPage.getPageBody().should('contain', texts.statusOff);
      cy.then(() => {
        readPrincipal(tokens.access_token).then((principalResponse) => {
          expect(principalResponse.status).to.equal(503);
          expect(principalResponse.body).to.have.property('error', 'temporarily_unavailable');
        });
      });
    });

    it('switching delegated access on should be refused without a usable reason', (): void => {
      const { texts, tooShortReason } = staticFixtures.killSwitch;

      loginAsAdmin();
      killSwitchPage.visit();

      killSwitchPage.switchOn('   ');
      killSwitchPage.getForm().should('contain', texts.reasonRequired);

      killSwitchPage.switchOn(tooShortReason);
      killSwitchPage.getForm().should('contain', texts.reasonTooShort);

      killSwitchPage.getPageBody().should('contain', texts.statusOff);
      cy.then(() => {
        readPrincipal(tokens.access_token).its('status').should('equal', 503);
      });
    });

    it('back office user should switch delegated access on again with a reason and the client acts again', (): void => {
      const { texts, enableReason } = staticFixtures.killSwitch;

      loginAsAdmin();
      killSwitchPage.visit();
      killSwitchPage.switchOn(enableReason);

      killSwitchPage.getFlashMessage().should('contain', texts.enabled);
      killSwitchPage.getPageBody().should('contain', texts.statusOn);
      cy.then(() => {
        readPrincipal(tokens.access_token).its('status').should('equal', 200);
      });
    });

    it('back office user should narrow the scope ceiling of a client to the scopes the shop supports', (): void => {
      const { supportedScopes, narrowedScope, removedScope, savedMessage } = staticFixtures.scopeCeiling;

      loginAsAdmin();
      clientListPage.visit();
      clientListPage.editScopeCeiling(client.clientId);

      scopeCeilingPage.getScopeCheckboxes().should('have.length', supportedScopes.length);
      scopeCeilingPage.getScopeCheckboxes().each(($checkbox) => {
        expect(supportedScopes).to.include($checkbox.val());
        expect($checkbox.prop('checked')).to.equal(true);
      });

      scopeCeilingPage.setScope(removedScope, false);
      scopeCeilingPage.save();

      clientListPage.getFlashMessage().should('contain', savedMessage);
      clientListPage.findClient(client.clientId).then((getRow) => {
        expect(getRow).not.to.equal(null);

        if (getRow) {
          getRow().should('contain', narrowedScope).and('not.contain', removedScope);
        }
      });
    });

    it('back office user should approve a self-registered client upfront so that its customer can allow access', (): void => {
      const { supportedScopes } = staticFixtures.scopeCeiling;
      const softwareId = `${staticFixtures.dynamicClient.softwareId}-${Date.now()}-${Cypress._.random(1000, 9999)}`;

      requestDynamicClientRegistration(
        JSON.stringify({
          client_name: staticFixtures.dynamicClient.clientName,
          redirect_uris: [staticFixtures.redirectUri],
          software_id: softwareId,
        })
      ).then((registrationResponse) => {
        expect(registrationResponse.status).to.equal(201);

        dynamicClient = {
          clientId: String(registrationResponse.body.client_id),
          name: staticFixtures.dynamicClient.clientName,
          redirectUri: staticFixtures.redirectUri,
          scope: supportedScopes.join(' '),
        };
      });

      cy.then(() => {
        clientAuthorizationScenario.openConsentPage({
          client: dynamicClient,
          email: staticFixtures.customer.email,
          password: staticFixtures.defaultPassword,
        });
      });
      consentPage.getNoScopesNotice().should('have.text', staticFixtures.noPermissionsNotice);
      consentPage.getAllowButton().should('not.exist');

      loginAsAdmin();
      clientListPage.visit();
      cy.then(() => {
        clientListPage.editScopeCeiling(dynamicClient.clientId);
      });
      // Both scopes, not only order:place: the principal call the story ends with needs principal-read.
      supportedScopes.forEach((scope) => scopeCeilingPage.setScope(scope, true));
      scopeCeilingPage.save();
      clientListPage.getFlashMessage().should('contain', staticFixtures.scopeCeiling.savedMessage);

      cy.then(() => {
        clientAuthorizationScenario
          .execute({
            client: dynamicClient,
            email: staticFixtures.customer.email,
            password: staticFixtures.defaultPassword,
            orderLimit: staticFixtures.b2cConsentLimit.amount,
          })
          .then(({ proofKey, response }) => {
            expect(response.error).to.equal(null);

            exchangeAuthorizationCode(dynamicClient, String(response.code), proofKey).then((tokenResponse) => {
              expect(tokenResponse.status).to.equal(200);
              expect(tokenResponse.body.scope.split(' ')).to.include(ORDER_PLACE_SCOPE);

              readPrincipal(tokenResponse.body.access_token).then((principalResponse) => {
                expect(principalResponse.status).to.equal(200);
                expect(principalResponse.body.data.attributes.principalType).to.equal('customer');
              });
            });
          });
      });
    });
  }
);
