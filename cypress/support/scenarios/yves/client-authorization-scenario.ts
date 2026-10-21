import { ConsentPage, LoginPage } from '@pages/yves';
import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';

import {
  AgenticCommerceAuthorizationResponse,
  AgenticCommerceClient,
  AgenticCommerceProofKey,
} from '../../types/api/agentic-commerce';
import {
  buildAuthorizationUrl,
  createProofKey,
  interceptAuthorizationResponse,
  readAuthorizationResponse,
} from '../../utils/api/agentic-commerce';

/**
 * Plays the customer's side of the authorization code flow: the client sends the browser to
 * `/connect/authorize`, the customer logs in, decides on the consent page, and the browser is
 * sent back to the client's redirect URI. The login goes through the form on purpose: the parked
 * authorization request is handed back only after a real login, which a cached session skips.
 */
@injectable()
@autoWired
export class ClientAuthorizationScenario {
  @inject(LoginPage) private loginPage: LoginPage;
  @inject(ConsentPage) private consentPage: ConsentPage;

  execute = (params: ExecuteParams): Cypress.Chainable<AuthorizationResult> => {
    const state = `state-${Date.now()}`;

    return createProofKey().then((proofKey) => {
      interceptAuthorizationResponse(params.client);

      cy.visit(buildAuthorizationUrl(params.client, proofKey, state));
      this.loginPage.login({ email: params.email, password: params.password });

      if (params.storeName) {
        this.consentPage.selectStore(params.storeName);
      }

      if (params.orderLimit !== undefined) {
        this.consentPage.enterOrderLimit(params.orderLimit);
      }

      if (params.allow === false) {
        this.consentPage.deny();
      } else {
        this.consentPage.allow();
      }

      return readAuthorizationResponse().then((response) => ({ state, proofKey, response }));
    });
  };

  openConsentPage = (params: Omit<ExecuteParams, 'allow' | 'storeName' | 'orderLimit'>): void => {
    createProofKey().then((proofKey) => {
      cy.visit(buildAuthorizationUrl(params.client, proofKey, `state-${Date.now()}`));
      this.loginPage.login({ email: params.email, password: params.password });
    });
  };
}

interface ExecuteParams {
  client: AgenticCommerceClient;
  email: string;
  password: string;
  storeName?: string;
  allow?: boolean;
  orderLimit?: string;
}

export interface AuthorizationResult {
  state: string;
  proofKey: AgenticCommerceProofKey;
  response: AgenticCommerceAuthorizationResponse;
}
