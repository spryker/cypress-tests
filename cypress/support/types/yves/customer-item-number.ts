export interface CustomerItemNumberSearchStaticFixtures {
  defaultPassword: string;
  companyUser: CustomerItemNumberCompanyUser;
  itemNumberPrefix: string;
  firstSuggestedItemNumber: string;
  exactMatch: CustomerItemNumberMatch;
}

export interface CustomerItemNumberCompanyUser {
  email: string;
}

export interface CustomerItemNumberMatch {
  itemNumber: string;
  sku: string;
  productName: string;
}
