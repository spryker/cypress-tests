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

export interface AgenticCommerceDynamicRegistrationStaticFixtures extends AgenticCommerceStaticFixtures {
  dynamicClient: { clientName: string; softwareId: string; foreignRedirectUri: string; requestMaxBytes: number };
}

export interface AgenticCommerceClientRegistration {
  client_id?: string;
  client_id_issued_at?: number;
  client_name?: string;
  redirect_uris?: string[];
  grant_types?: string[];
  response_types?: string[];
  token_endpoint_auth_method?: string;
  software_id?: string;
  error?: string;
  error_description?: string;
}

export interface AgenticCommerceOrderPlacementStaticFixtures extends AgenticCommerceStaticFixtures {
  scopeWithOrderPlacement: string;
  orderPlacementScopeLabel: string;
  buyerWithLimit: { email: string; roleLimitHint: string };
  consentLimit: { amount: string; label: string };
  invalidConsentLimits: string[];
  b2cConsentLimit: { amount: string; label: string };
  texts: { ordersNotPlaced: string; maximumPerOrderPrefix: string };
}

export interface AgenticCommerceOrderApprovalStaticFixtures {
  defaultPassword: string;
  buyerWithLimit: { email: string };
  approver: { email: string; fullName: string };
  store: string;
  currency: string;
  priceMode: string;
  idShipmentMethod: number;
  payment: { paymentProviderName: string; paymentMethodName: string };
  address: Record<string, string>;
  requireApprovalMessage: string;
}

export interface AgenticCommerceOrderApprovalDynamicFixtures {
  product: { sku: string };
}
