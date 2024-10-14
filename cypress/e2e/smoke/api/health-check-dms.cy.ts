import { container } from '@utils';
import { CreateStoreScenario, UserLoginScenario } from '@scenarios/backoffice';
import { HealthCheckDmsStaticFixtures } from '@interfaces/smoke';

/**
 * Reminder: Use only static fixtures for smoke tests, don't use dynamic fixtures, cli commands.
 */
(Cypress.env('isDynamicStoreEnabled') ? describe : describe.skip)('health check dms', { tags: '@smoke' }, () => {
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

  it('GLUE Backend endpoint should return 200', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/token',
      headers: {
        Store: staticFixtures.store.name,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grantType=password&username=${staticFixtures.rootUser.username}&password=${staticFixtures.defaultPassword}`,
    })
      .its('status')
      .should('eq', 200);
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
