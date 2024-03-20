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

export interface RequestManagementDynamicFixtures {
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
  businessUnit3FromCompany1: CompanyBusinessUnit;
  businessUnit4FromCompany1: CompanyBusinessUnit;
  businessUnit5FromCompany1: CompanyBusinessUnit;
  businessUnit6FromCompany1: CompanyBusinessUnit;
  businessUnit7FromCompany1: CompanyBusinessUnit;
  companyUser1FromCompany1: CompanyUser;
  companyUser2FromCompany1: CompanyUser;

  company2: Company;
  businessUnit1FromCompany2: CompanyBusinessUnit;
  businessUnit2FromCompany2: CompanyBusinessUnit;
  companyUser1FromCompany2: CompanyUser;

  request1FromMerchant1: MerchantRelationRequest;
  request2FromMerchant1: MerchantRelationRequest;
  request3FromMerchant1: MerchantRelationRequest;
  request4FromMerchant1: MerchantRelationRequest;
  request5FromMerchant1: MerchantRelationRequest;
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

export interface RequestManagementStaticFixtures {
  defaultPassword: string;
  internalComment: string;
}

export interface MerchantB2bContractRequestsStaticFixtures {
  defaultPassword: string;
}
