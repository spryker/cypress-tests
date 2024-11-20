import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class AssignStoreToDefaultShipmentTypesScenario {
  execute = (params: ExecuteParams): void => {
    cy.request({
      method: 'POST',
      url: Cypress.env().glueBackendUrl + '/token',
      headers: {
        Store: params.store,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grantType=password&username=${params.username}&password=${params.password}`,
    }).then((response) => {
      const authToken = response.body.access_token;
      cy.wrap(authToken).as('authToken');

      cy.request({
        method: 'GET',
        url: Cypress.env().glueBackendUrl + '/shipment-types',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/vnd.api+json',
        },
      }).then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const deliveryIds = response.body.data.map((item: any) => item.id);
        cy.wrap(deliveryIds).as('deliveryIds');
      });

      cy.request({
        method: 'GET',
        url: Cypress.env().backofficeUrl + '/store-gui/list/table',
      }).then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const storeNames = response.body.data.map((store: any) => store[1]);
        cy.wrap(storeNames).as('storeNames');
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cy.get('@deliveryIds').then((deliveryIds: any) => {
        cy.get('@storeNames').then((storeNames) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          deliveryIds.forEach((deliveryId: any) => {
            cy.request({
              method: 'PATCH',
              url: `${Cypress.env().glueBackendUrl}/shipment-types/${deliveryId}`,
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/vnd.api+json',
              },
              body: {
                data: {
                  type: 'shipment-types',
                  attributes: {
                    stores: storeNames,
                  },
                },
              },
            }).then((patchResponse) => {
              expect(patchResponse.status).to.eq(200);
            });
          });
        });
      });
    });

    cy.runCliCommands(['console queue:worker:start --stop-when-empty']);
  };
}

interface ExecuteParams {
  store: string;
  username: string;
  password: string;
}
