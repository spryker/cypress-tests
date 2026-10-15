export interface AgenticCommerceClient {
  clientId: string;
  name: string;
  redirectUri: string;
  scope: string;
}

export interface AgenticCommerceProofKey {
  verifier: string;
  challenge: string;
}

export interface AgenticCommerceAuthorizationResponse {
  code: string | null;
  error: string | null;
  state: string | null;
  issuer: string | null;
}

export interface AgenticCommerceTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface AgenticCommerceStaticFixtures {
  defaultPassword: string;
  scope: string;
  redirectUri: string;
  customer: { email: string; customerReference: string };
  companyUser: { email: string; companyName: string };
  backofficeUser: { username: string; password: string };
}
