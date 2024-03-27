import {
  Company,
  CompanyBusinessUnit,
  CompanyUser,
  Customer,
  Merchant,
  MerchantRelationRequest,
  Url,
  User,
} from './shared';

export interface RequestManagementDynamicFixtures {
  rootUser: User;

  merchant1: Merchant;
  merchantUrl1: Url;
  merchantUser1FromMerchant1: User;
  merchantUser2FromMerchant1: User;

  merchant2: Merchant;
  merchantUrl2: Url;
  merchantUserFromMerchant2: User;

  merchant3: Merchant;
  merchantUrl3: Url;

  customer: Customer;

  company1: Company;
  businessUnit1FromCompany1: CompanyBusinessUnit;
  businessUnit2FromCompany1: CompanyBusinessUnit;
  companyUser1FromCompany1: CompanyUser;
  companyUser2FromCompany1: CompanyUser;

  company2: Company;
  businessUnit1FromCompany2: CompanyBusinessUnit;
  businessUnit2FromCompany2: CompanyBusinessUnit;
  companyUser1FromCompany2: CompanyUser;

  requestFromMerchant1: MerchantRelationRequest;
  requestFromMerchant2: MerchantRelationRequest;
}

export interface RequestManagementStaticFixtures {
  defaultPassword: string;
  internalCommentFromMerchantUser1: string;
  internalCommentFromMerchantUser2: string;
  internalCommentFromRootUser: string;
  internalCommentFromRootUserWithEmoji: string;
}
