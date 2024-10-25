import { container } from '@utils';
import {
    CreateStoreScenario,
    EnableProductForAllStoresScenario,
    EnableWarehouseForAllStoresScenario,
    CreateProductScenario,
    UserLoginScenario,
    EnableCmsBlockForAllStoresScenario,
    EnablePaymentMethodForAllStoresScenario,
    EnableShipmentMethodForAllStoresScenario
} from '@scenarios/backoffice';
import { HealthCheckDmsStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)('health check dms', { tags: '@dms' }, () => {
  const userLoginScenario = container.get(UserLoginScenario);
  const createStoreScenario = container.get(CreateStoreScenario);

    let staticFixtures: HealthCheckDmsStaticFixtures;

  before((): void => {
    staticFixtures = Cypress.env('staticFixtures');
    createNewStoreInBackoffice();
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

    describe('GLUE Backend Tests', () => {
        before(function () {
            cy.request({
                method: 'POST',
                url: Cypress.env().glueBackendUrl + '/token',
                headers: {
                    Store: staticFixtures.store.name,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grantType=password&username=${staticFixtures.rootUser.username}&password=${staticFixtures.defaultPassword}`,
            })
                .then((response) => {
                    expect(response.status).to.eq(200);
                    cy.wrap(response.body.access_token).as('authToken');
                });
        });

        ['b2c', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? it.skip : it ('Should receive access for admin and check services endpoint', function () {
            cy.get('@authToken').then((authToken) => {
                cy.request({
                    method: 'GET',
                    url: Cypress.env().glueBackendUrl + '/services',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        Authorization: `Bearer ${authToken}`,
                        Store: staticFixtures.store.name,
                    },
                    failOnStatusCode: false
                })
                    .then((response) => {
                        expect(response.status).to.eq(200);
                        expect(response.body.data[0].type).to.eq('services');
                    });
            });
        });
    });

  it('GLUE Storefront endpoint should return 200', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env().glueStorefrontUrl + '/stores',
      headers: {
        Store: staticFixtures.store.name,
        'Content-Type': 'application/vnd.api+json',
      },
    })
      .its('status')
      .should('eq', 200);
  });

  function createNewStoreInBackoffice(): void {
    userLoginScenario.execute({
      username: staticFixtures.rootUser.username,
      password: staticFixtures.defaultPassword,
    });

    createStoreScenario.execute({ store: staticFixtures.store });
  }
});
