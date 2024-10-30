import { autoWired } from '@utils';
import { injectable } from 'inversify';

@injectable()
@autoWired
export class EnableShipmentTypeForAllStoresScenario {

    execute = (params: ExecuteParams): void => {
        cy.request({
            method: 'POST',
            url: Cypress.env().glueBackendUrl + '/token',
            headers: {
                Store: params.store,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grantType=password&username=${params.username}&password=${params.password}`,
        })
            .then((response) => {
                expect(response.status).to.eq(200);
                const authToken = response.body.access_token;
                cy.wrap(authToken).as('authToken');

                cy.request({
                    method: 'GET',
                    url: Cypress.env().glueBackendUrl + '/shipment-types',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/vnd.api+json',
                    },
                })
                    .then((response) => {
                        const deliveryIds = response.body.data
                            .filter((item: any) => item.attributes.name.includes('Delivery'))
                            .map((item: any) => item.id);
                        cy.wrap(deliveryIds).as('deliveryIds');
                    });

                cy.request({
                    method: 'GET',
                    url: Cypress.env().backofficeUrl + '/store-gui/list/table',
                }).then((response) => {
                    const storeNames = response.body.data.map((store: any) => store[1]);
                    cy.wrap(storeNames).as('storeNames');
                });

                cy.get('@deliveryIds').then((deliveryIds: any) => {
                    cy.get('@storeNames').then((storeNames: string[]) => {
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
                                            stores: storeNames
                                        }
                                    }
                                }
                            }).then((patchResponse) => {
                                expect(patchResponse.status).to.eq(200);
                            });
                        });
                    });
                });
            });

    };
}

interface ExecuteParams {
  store: string;
    username: string;
    password: string;
}
