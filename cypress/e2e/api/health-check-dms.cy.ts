import { container } from '@utils';
import { CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { HealthCheckDmsStaticFixtures } from '@interfaces/api';
import { HealthCheckDmsDynamicFixtures } from "../../support/types/api";

(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)('health check dms', { tags: '@dms' }, () => {
  const userLoginScenario = container.get(UserLoginScenario);
  const createStoreScenario = container.get(CreateStoreScenario);

  let staticFixtures: HealthCheckDmsStaticFixtures;
  let dynamicFixtures: HealthCheckDmsDynamicFixtures;

  before(function () {

    ({ staticFixtures, dynamicFixtures } = Cypress.env());
    createNewStoreInBackoffice();
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grantType=password&username=admin@spryker.com&password=${staticFixtures.defaultPassword}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.wrap(response.body.access_token).as('authToken');
    });
  });

  ['b2c', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId'))
      ? it.skip
      : it('Check services endpoint', function () {
        cy.get('@authToken').then((authToken) => {
          cy.request({
            method: 'GET',
            url: Cypress.env().glueBackendUrl + '/services',
            headers: {
              'Content-Type': 'application/vnd.api+json',
              Authorization: `Bearer ${authToken}`,
            },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data[0].type).to.eq('services');
          });
        });
      });

  it('GLUE endpoint should return 200', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env().glueUrl + '/catalog-search',
      headers: {
        Store: staticFixtures.store.name,
      },
    })
      .its('status')
      .should('eq', 200);
  });

  it('GLUE Backend endpoint should return 200', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grantType=password&username=${dynamicFixtures.rootUser.username}&password=${staticFixtures.defaultPassword}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });



  it('GLUE Storefront endpoint should return 200', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env().glueStorefrontUrl + '/stores',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
    })
      .its('status')
      .should('eq', 200);
  });

  function createNewStoreInBackoffice(): void {
    userLoginScenario.execute({
      username: dynamicFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    createStoreScenario.execute({ store: staticFixtures.store });
  }
});
