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
  authorization_details?: Array<Record<string, unknown>>;
}

export interface AgenticCommerceTokenError {
  error: string;
  error_description: string;
}

export interface AgenticCommerceStaticFixtures {
  defaultPassword: string;
  scope: string;
  redirectUri: string;
  customer: { email: string; customerReference: string };
  companyUser: { email: string; companyName: string };
  backofficeUser: { username: string; password: string };
}

export interface AgenticCommerceConsentConstraintsStaticFixtures extends AgenticCommerceStaticFixtures {
  scopeWithOrderPlacement: string;
  limits: {
    orderLimitAmount: string;
    budgetAmount: string;
    budgetPeriod: string;
    sellerReference: string;
    categoryKey: string;
    constraintsColumnTexts: string[];
  };
}

export interface AgenticCommerceMetadataStaticFixtures extends AgenticCommerceStaticFixtures {
  authorizationDetailsTypes: string[];
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
  approver: { email: string; fullName: string; firstName: string; lastName: string };
  store: string;
  currency: string;
  priceMode: string;
  idShipmentMethod: number;
  payment: { paymentProviderName: string; paymentMethodName: string };
  address: Record<string, string>;
  approvedLabel: string;
  requireApprovalErrorCode: string;
  requireApprovalMessage: string;
}

export interface AgenticCommerceOrderApprovalDynamicFixtures {
  product: { sku: string };
}

export interface AgenticCommerceQuoteApprovalStaticFixtures {
  defaultPassword: string;
  buyerWithLimit: { email: string };
  approver: { email: string; firstName: string; lastName: string };
  store: string;
  currency: string;
  priceMode: string;
  idShipmentMethod: number;
  payment: { paymentProviderName: string; paymentMethodName: string };
  address: Record<string, string>;
  approvalAlreadyRequestedErrorCode: string;
}

export interface AgenticCommerceQuoteApprovalDynamicFixtures {
  product: { sku: string };
}

export interface AgenticCommerceKillSwitchStaticFixtures extends AgenticCommerceStaticFixtures {
  scopeCeiling: { supportedScopes: string[]; narrowedScope: string; removedScope: string; savedMessage: string };
  killSwitch: {
    disableReason: string;
    enableReason: string;
    tooShortReason: string;
    texts: {
      statusOn: string;
      statusOff: string;
      disabled: string;
      enabled: string;
      reasonRequired: string;
      reasonTooShort: string;
    };
  };
  dynamicClient: { clientName: string; softwareId: string };
  noPermissionsNotice: string;
  b2cConsentLimit: { amount: string; label: string; constraintsColumnText: string };
}

export interface AgenticCommerceCompanyConsentsStaticFixtures {
  defaultPassword: string;
  scope: string;
  scopeLabel: string;
  scopeWithOrderPlacement: string;
  consentLimit: { amount: string; label: string };
  redirectUri: string;
  companyAdmin: { email: string; fullName: string };
  companyUser: { email: string; fullName: string };
  otherCompanyUser: { email: string; fullName: string };
  userWithoutPermission: { email: string };
  texts: { neverUsed: string; revoked: string; notInCompany: string; revoke: string; connectedApps: string };
}

export interface AgenticCommerceCustomerLimitsStaticFixtures {
  defaultPassword: string;
  scopeWithOrderPlacement: string;
  redirectUri: string;
  customer: { email: string };
  orderLimit: { amount: string; label: string };
  authorizationDetailsTypes: {
    orderTotalLimit: string;
    orderBudget: string;
    merchantAllowlist: string;
    categoryAllowlist: string;
    unknown: string;
  };
  merchants: { spryker: { reference: string; name: string }; videoKing: { reference: string; name: string } };
  categories: { computer: { key: string; name: string }; notebooks: { key: string; name: string } };
  budget: {
    amount: string;
    period: string;
    connectedAppsLabel: string;
    requestedAmount: number;
    requestedDisplay: string;
    loweredAmount: string;
    raisedAmount: string;
  };
  periodLabels: string[];
  texts: {
    budgetLabel: string;
    sellersLabel: string;
    categoriesLabel: string;
    sellersLine: string;
    categoriesLine: string;
    widerThanRequested: string;
    requestedRemoved: string;
    tokenEndpointNotSupported: string;
  };
}
