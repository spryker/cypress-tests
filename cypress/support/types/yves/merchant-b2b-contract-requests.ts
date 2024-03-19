import {
  Company,
  CompanyBusinessUnit,
  CompanyUser,
  Customer,
  Merchant,
  MerchantRelationRequest,
  ProductConcrete,
  ProductOffer,
  Url,
  User,
} from './shared';

export interface RequestCreationDynamicFixtures {
  merchant1: Merchant;
  merchantUrl1: Url;
  merchant2: Merchant;
  merchantUrl2: Url;
  merchant3: Merchant;
  merchantUrl3: Url;

  concreteProduct: ProductConcrete;
  productOfferFromMerchant1: ProductOffer;
  productOfferFromMerchant2: ProductOffer;
  productOfferFromMerchant3: ProductOffer;

  customer: Customer;

  businessUnit1FromCompany1: CompanyBusinessUnit;
  businessUnit2FromCompany1: CompanyBusinessUnit;
  companyUser1FromCompany1: CompanyUser;
  companyUser2FromCompany1: CompanyUser;

  businessUnit1FromCompany2: CompanyBusinessUnit;
  businessUnit2FromCompany2: CompanyBusinessUnit;
  companyUser1FromCompany2: CompanyUser;
}

export interface RequestManagementDynamicFixtures {
  merchant1: Merchant;
  merchant2: Merchant;
  merchant3: Merchant;

  customer: Customer;

  businessUnit1FromCompany1: CompanyBusinessUnit;
  businessUnit2FromCompany1: CompanyBusinessUnit;
  companyUser1FromCompany1: CompanyUser;
  companyUser2FromCompany1: CompanyUser;

  businessUnit1FromCompany2: CompanyBusinessUnit;
  businessUnit2FromCompany2: CompanyBusinessUnit;
  companyUser1FromCompany2: CompanyUser;

  pendingRequest: MerchantRelationRequest;
  canceledRequest: MerchantRelationRequest;
  approvedRequest: MerchantRelationRequest;
  rejectedRequest: MerchantRelationRequest;

  requestFromMerchant1: MerchantRelationRequest;
  requestFromMerchant2: MerchantRelationRequest;

  requestFromUnit1: MerchantRelationRequest;
  requestFromUnit2: MerchantRelationRequest;
}

export interface Dummy {
  merchant1: Merchant;
  merchantUrl1: Url;
  merchantUser1FromMerchant1: User;
  merchantUser2FromMerchant1: User;

  merchant2: Merchant;
  merchantUrl2: Url;
  merchantUserFromMerchant2: User;

  merchant3: Merchant;
  merchantUrl3: Url;
  merchantUserFromMerchant3: User;

  concreteProduct: ProductConcrete;
  productOfferFromMerchant1: ProductOffer;
  productOfferFromMerchant2: ProductOffer;
  productOfferFromMerchant3: ProductOffer;

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
}

export interface MerchantB2bContractRequestsStaticFixtures {
  defaultPassword: string;
}
