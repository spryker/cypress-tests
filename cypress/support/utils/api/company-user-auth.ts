import { authHeaders } from './auth';

/**
 * Logs in as the customer and exchanges the customer token for a token of the customer's first
 * company user (`POST /company-user-access-tokens`), the token a B2B storefront order is placed with.
 */
export function getCompanyUserAccessToken(email: string, password: string): Cypress.Chainable<string> {
  const glueUrl = Cypress.env().glueUrl;

  return cy.getCustomerAccessToken(email, password).then((customerAccessToken: string) =>
    cy
      .request({ method: 'GET', url: `${glueUrl}/company-users`, headers: authHeaders(customerAccessToken) })
      .then((companyUsersResponse) =>
        cy
          .request({
            method: 'POST',
            url: `${glueUrl}/company-user-access-tokens`,
            headers: authHeaders(customerAccessToken),
            body: {
              data: {
                type: 'company-user-access-tokens',
                attributes: { idCompanyUser: companyUsersResponse.body.data[0].id },
              },
            },
          })
          .then((response) => response.body.data.attributes.accessToken as string)
      )
  );
}
