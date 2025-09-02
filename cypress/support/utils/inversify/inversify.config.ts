import 'reflect-metadata';

import { Container, interfaces } from 'inversify';
import { REPOSITORIES } from './types';

import { SuiteAgentLoginRepository } from '../../pages/yves/agent-login/repositories/suite-agent-login-repository';
import { B2bCartRepository } from '../../pages/yves/cart/repositories/b2b-cart-repository';
import { SuiteCartRepository } from '../../pages/yves/cart/repositories/suite-cart-repository';
import { SuiteCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/suite-checkout-address-repository';
import { SuiteCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/suite-checkout-customer-repository';
import { SuiteCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/suite-checkout-payment-repository';
import { SuiteCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/suite-checkout-shipment-repository';
import { SuiteCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/suite-checkout-summary-repository';
import { B2bCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2b-comment-cart-repository';
import { SuiteCommentCartRepository } from '../../pages/yves/comment/cart/repositories/suite-comment-cart-repository';
import { B2bLoginRepository } from '../../pages/yves/login/repositories/b2b-login-repository';
import { SuiteLoginRepository } from '../../pages/yves/login/repositories/suite-login-repository';
import { B2bMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2b-multi-cart-repository';
import { SuiteMultiCartRepository } from '../../pages/yves/multi-cart/repositories/suite-multi-cart-repository';
import { SuiteCatalogRepository } from '../../pages/yves/catalog/repositories/suite-catalog-repository';
import { SuiteContentRepository } from '../../pages/yves/content/repositories/suite-content-repository';
import { B2cContentRepository } from '../../pages/yves/content/repositories/b2c-content-repository';
import { B2bContentRepository } from '../../pages/yves/content/repositories/b2b-content-repository';
import { B2cMpContentRepository } from '../../pages/yves/content/repositories/b2c-mp-content-repository';
import { B2bMpContentRepository } from '../../pages/yves/content/repositories/b2b-mp-content-repository';
import { SuiteCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/suite-company-user-select-repository';
import { SuiteMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/suite-merchant-relation-request-create-repository';
import { SuiteMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/suite-merchant-relation-request-details-repository';
import { SuiteMerchantRepository } from '../../pages/yves/merchant/repositories/suite-merchant-repository';
import { SuiteMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/suite-merchant-relation-request-index-repository';
import { SuiteProductRepository } from '../../pages/yves/product/repositories/suite-product-repository';
import { B2bMpMerchantRepository } from '../../pages/yves/merchant/repositories/b2b-mp-merchant-repository';
import { B2bMpLoginRepository } from '../../pages/yves/login/repositories/b2b-mp-login-repository';
import { B2bMpCartRepository } from '../../pages/yves/cart/repositories/b2b-mp-cart-repository';
import { B2bMpCatalogRepository } from '../../pages/yves/catalog/repositories/b2b-mp-catalog-repository';
import { B2bMpProductRepository } from '../../pages/yves/product/repositories/b2b-mp-product-repository';
import { B2bMpCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/b2b-mp-company-user-select-repository';
import { B2bMpMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/b2b-mp-merchant-relation-request-create-repository';
import { B2bMpMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/b2b-mp-merchant-relation-request-details-repository';
import { B2bMpMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/b2b-mp-merchant-relation-request-index-repository';
import { B2cMpLoginRepository } from '../../pages/yves/login/repositories/b2c-mp-login-repository';
import { B2cMpAgentLoginRepository } from '../../pages/yves/agent-login/repositories/b2c-mp-agent-login-repository';
import { B2cMpCartRepository } from '../../pages/yves/cart/repositories/b2c-mp-cart-repository';
import { B2cMpCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/b2c-mp-checkout-address-repository';
import { B2cMpCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/b2c-mp-checkout-customer-repository';
import { B2cMpCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/b2c-mp-checkout-payment-repository';
import { B2cMpCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/b2c-mp-checkout-shipment-repository';
import { B2cMpCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/b2c-mp-checkout-summary-repository';
import { B2bMpAgentLoginRepository } from '../../pages/yves/agent-login/repositories/b2b-mp-agent-login-repository';
import { B2bMpCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/b2b-mp-checkout-address-repository';
import { B2bMpCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/b2b-mp-checkout-customer-repository';
import { B2bMpCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/b2b-mp-checkout-payment-repository';
import { B2bMpCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/b2b-mp-checkout-shipment-repository';
import { B2bMpCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/b2b-mp-checkout-summary-repository';
import { B2bMpMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2b-mp-multi-cart-repository';
import { B2bMpCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2b-mp-comment-cart-repository';
import { B2bCatalogRepository } from '../../pages/yves/catalog/repositories/b2b-catalog-repository';
import { B2bProductRepository } from '../../pages/yves/product/repositories/b2b-product-repository';
import { B2bCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/b2b-company-user-select-repository';
import { B2bMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/b2b-merchant-relation-request-create-repository';
import { B2bMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/b2b-merchant-relation-request-details-repository';
import { B2bMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/b2b-merchant-relation-request-index-repository';
import { B2bMerchantRepository } from '../../pages/yves/merchant/repositories/b2b-merchant-repository';
import { B2cLoginRepository } from '../../pages/yves/login/repositories/b2c-login-repository';
import { B2cAgentLoginRepository } from '../../pages/yves/agent-login/repositories/b2c-agent-login-repository';
import { B2cCartRepository } from '../../pages/yves/cart/repositories/b2c-cart-repository';
import { B2cCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/b2c-checkout-address-repository';
import { B2cCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/b2c-checkout-customer-repository';
import { B2cCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/b2c-checkout-payment-repository';
import { B2cCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/b2c-checkout-shipment-repository';
import { B2cCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/b2c-checkout-summary-repository';
import { B2cCatalogRepository } from '../../pages/yves/catalog/repositories/b2c-catalog-repository';
import { B2cProductRepository } from '../../pages/yves/product/repositories/b2c-product-repository';
import { SuiteCustomerOverviewRepository } from '../../pages/yves/customer/overview/repositories/suite-customer-overview-repository';
import { B2cCustomerOverviewRepository } from '../../pages/yves/customer/overview/repositories/b2c-customer-overview-repository';
import { B2bCustomerOverviewRepository } from '../../pages/yves/customer/overview/repositories/b2b-customer-overview-repository';
import { B2cMpCustomerOverviewRepository } from '../../pages/yves/customer/overview/repositories/b2c-mp-customer-overview-repository';
import { B2bMpCustomerOverviewRepository } from '../../pages/yves/customer/overview/repositories/b2b-mp-customer-overview-repository';
import { B2cMpCatalogRepository } from '../../pages/yves/catalog/repositories/b2c-mp-catalog-repository';
import { B2cMpProductRepository } from '../../pages/yves/product/repositories/b2c-mp-product-repository';
import { B2cMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2c-multi-cart-repository';
import { B2cCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2c-comment-cart-repository';
import { B2cCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/b2c-company-user-select-repository';
import { B2cMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/b2c-merchant-relation-request-create-repository';
import { B2cMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/b2c-merchant-relation-request-details-repository';
import { B2cMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/b2c-merchant-relation-request-index-repository';
import { B2cMerchantRepository } from '../../pages/yves/merchant/repositories/b2c-merchant-repository';
import { SuiteMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/repositories/suite-multi-factor-auth-repository';
import { B2bMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/repositories/b2b-multi-factor-auth-repository';
import { B2cMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/repositories/b2c-multi-factor-auth-repository';
import { B2bMpMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/repositories/b2b-mp-multi-factor-auth-repository';
import { B2cMpMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/repositories/b2c-mp-multi-factor-auth-repository';
import { B2bCheckoutCustomerRepository } from '../../pages/yves/checkout/customer/repositories/b2b-checkout-customer-repository';
import { B2bCheckoutAddressRepository } from '../../pages/yves/checkout/address/repositories/b2b-checkout-address-repository';
import { B2bCheckoutShipmentRepository } from '../../pages/yves/checkout/shipment/repositories/b2b-checkout-shipment-repository';
import { B2bCheckoutPaymentRepository } from '../../pages/yves/checkout/payment/repositories/b2b-checkout-payment-repository';
import { B2bCheckoutSummaryRepository } from '../../pages/yves/checkout/summary/repositories/b2b-checkout-summary-repository';
import { B2bAgentLoginRepository } from '../../pages/yves/agent-login/repositories/b2b-agent-login-repository';
import { B2cMpMultiCartRepository } from '../../pages/yves/multi-cart/repositories/b2c-mp-multi-cart-repository';
import { B2cMpCommentCartRepository } from '../../pages/yves/comment/cart/repositories/b2c-mp-comment-cart-repository';
import { B2cMpCompanyUserSelectRepository } from '../../pages/yves/company/user/select/repositories/b2c-mp-company-user-select-repository';
import { B2cMpMerchantRelationRequestCreateRepository } from '../../pages/yves/company/merchant-relation-request/create/repositories/b2c-mp-merchant-relation-request-create-repository';
import { B2cMpMerchantRelationRequestDetailsRepository } from '../../pages/yves/company/merchant-relation-request/details/repositories/b2c-mp-merchant-relation-request-details-repository';
import { B2cMpMerchantRelationRequestIndexRepository } from '../../pages/yves/company/merchant-relation-request/index/repositories/b2c-mp-merchant-relation-request-index-repository';
import { B2cMpMerchantRepository } from '../../pages/yves/merchant/repositories/b2c-mp-merchant-repository';
import { SuiteProductComparisonRepository } from '../../pages/yves/product-comparison/repositories/suite-product-comparison-repository';
import { B2cProductComparisonRepository } from '../../pages/yves/product-comparison/repositories/b2c-product-comparison-repository';
import { B2bProductComparisonRepository } from '../../pages/yves/product-comparison/repositories/b2b-product-comparison-repository';
import { B2cMpProductComparisonRepository } from '../../pages/yves/product-comparison/repositories/b2c-mp-product-comparison-repository';
import { B2bMpProductComparisonRepository } from '../../pages/yves/product-comparison/repositories/b2b-mp-product-comparison-repository';
import { SuiteOrderDetailsRepository } from '../../pages/yves/customer/order/repositories/suite-order-details-repository';
import { B2cOrderDetailsRepository } from '../../pages/yves/customer/order/repositories/b2c-order-details-repository';
import { B2bOrderDetailsRepository } from '../../pages/yves/customer/order/repositories/b2b-order-details-repository';
import { B2cMpOrderDetailsRepository } from '../../pages/yves/customer/order/repositories/b2c-mp-order-details-repository';
import { B2bMpOrderDetailsRepository } from '../../pages/yves/customer/order/repositories/b2b-mp-order-details-repository';
import { SuiteHomeRepository } from '../../pages/yves/home/repositories/suite-home-repository';
import { B2cHomeRepository } from '../../pages/yves/home/repositories/b2c-home-repository';
import { B2bHomeRepository } from '../../pages/yves/home/repositories/b2b-home-repository';
import { B2cMpHomeRepository } from '../../pages/yves/home/repositories/b2c-mp-home-repository';
import { B2bMpHomeRepository } from '../../pages/yves/home/repositories/b2b-mp-home-repository';
import { B2cYvesRepository } from '../../pages/yves/repositories/b2c-yves-repository';
import { B2bYvesRepository } from '../../pages/yves/repositories/b2b-yves-repository';
import { B2cMpYvesRepository } from '../../pages/yves/repositories/b2c-mp-yves-repository';
import { B2bMpYvesRepository } from '../../pages/yves/repositories/b2b-mp-yves-repository';
import { SuiteYvesRepository } from '../../pages/yves/repositories/suite-yves-repository';
import { SuiteManageCompanyRoleUserRepository } from '../../pages/yves/company/user/manage/repositories/suite-manage-company-role-user-repository';
import { B2bManageCompanyRoleUserRepository } from '../../pages/yves/company/user/manage/repositories/b2b-manage-company-role-user-repository';
import { B2bMpManageCompanyRoleUserRepository } from '../../pages/yves/company/user/manage/repositories/b2b-mp-manage-company-role-user-repository';
import { SuiteSspInquiryRepository } from '../../pages/yves/ssp-inquiry/repositories/suite-ssp-inquiry-repository';
import { B2bMpSspInquiryRepository } from '../../pages/yves/ssp-inquiry/repositories/b2b-mp-ssp-inquiry-repository';
import { B2bSspInquiryRepository } from '../../pages/yves/ssp-inquiry/repositories/b2b-ssp-inquiry-repository';
import { SuiteSspServiceRepository } from '../../pages/yves/ssp-service/repositories/suite-ssp-service-repository';
import { B2bMpSspServiceRepository } from '../../pages/yves/ssp-service/repositories/b2b-mp-ssp-service-repository';
import { B2bSspServiceRepository } from '../../pages/yves/ssp-service/repositories/b2b-ssp-service-repository';
import { SuiteCompanyRoleIndexRepository } from '../../pages/yves/company/company-role/index/repositories/suite-company-role-index-repository';
import { SuiteCompanyRoleCreateRepository } from '../../pages/yves/company/company-role/create/repositories/suite-company-role-create-repository';
import { B2bMpCompanyRoleCreateRepository } from '../../pages/yves/company/company-role/create/repositories/b2b-mp-company-role-create-repository';
import { B2bMpCompanyRoleIndexRepository } from '../../pages/yves/company/company-role/index/repositories/b2b-mp-company-role-index-repository';
import { B2bCompanyRoleIndexRepository } from '../../pages/yves/company/company-role/index/repositories/b2b-company-role-index-repository';
import { B2bCompanyRoleCreateRepository } from '../../pages/yves/company/company-role/create/repositories/b2b-company-role-create-repository';
import { B2cCompanyRoleIndexRepository } from '../../pages/yves/company/company-role/index/repositories/b2c-company-role-index-repository';
import { B2cCompanyRoleCreateRepository } from '../../pages/yves/company/company-role/create/repositories/b2c-company-role-create-repository';
import { B2cMpCompanyRoleIndexRepository } from '../../pages/yves/company/company-role/index/repositories/b2c-mp-company-role-index-repository';
import { B2cMpCompanyRoleCreateRepository } from '../../pages/yves/company/company-role/create/repositories/b2c-mp-company-role-create-repository';
import { B2cMpManageCompanyRoleUserRepository } from '../../pages/yves/company/user/manage/repositories/b2c-mp-manage-company-role-user-repository';
import { B2cManageCompanyRoleUserRepository } from '../../pages/yves/company/user/manage/repositories/b2c-manage-company-role-user-repository';
import { SuiteCustomerDeleteRepository } from '../../pages/yves/customer/customer-delete/repositories/suite-customer-delete-repository';
import { B2cCustomerDeleteRepository } from '../../pages/yves/customer/customer-delete/repositories/b2c-customer-delete-repository';
import { B2bCustomerDeleteRepository } from '../../pages/yves/customer/customer-delete/repositories/b2b-customer-delete-repository';
import { B2cMpCustomerDeleteRepository } from '../../pages/yves/customer/customer-delete/repositories/b2c-mp-customer-delete-repository';
import { B2bMpCustomerDeleteRepository } from '../../pages/yves/customer/customer-delete/repositories/b2b-mp-customer-delete-repository';
import { SuiteCustomerProfileRepository } from '../../pages/yves/customer/profile/repositories/suite-customer-profile-repository';
import { B2cCustomerProfileRepository } from '../../pages/yves/customer/profile/repositories/b2c-customer-profile-repository';
import { B2bCustomerProfileRepository } from '../../pages/yves/customer/profile/repositories/b2b-customer-profile-repository';
import { B2cMpCustomerProfileRepository } from '../../pages/yves/customer/profile/repositories/b2c-mp-customer-profile-repository';
import { B2bMpCustomerProfileRepository } from '../../pages/yves/customer/profile/repositories/b2b-mp-customer-profile-repository';
import { SuiteSspAssetRepository } from '../../pages/yves/ssp-asset/repositories/suite-ssp-asset-repository';
import { SuiteAgentMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/agent/repositories/suite-agent-multi-factor-auth-repository';
import { B2cAgentMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/agent/repositories/b2c-agent-multi-factor-auth-repository';
import { B2bAgentMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/agent/repositories/b2b-agent-multi-factor-auth-repository';
import { B2cMpAgentMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/agent/repositories/b2c-mp-agent-multi-factor-auth-repository';
import { B2bMpAgentMultiFactorAuthRepository } from '../../pages/yves/multi-factor-auth/agent/repositories/b2b-mp-agent-multi-factor-auth-repository';
import { SuiteUserMultiFactorAuthRepository } from '../../pages/backoffice/multi-factor-auth/repositories/suite-user-multi-factor-auth-repository';
import { B2cUserMultiFactorAuthRepository } from '../../pages/backoffice/multi-factor-auth/repositories/b2c-user-multi-factor-auth-repository';
import { B2bUserMultiFactorAuthRepository } from '../../pages/backoffice/multi-factor-auth/repositories/b2b-user-multi-factor-auth-repository';
import { B2cMpUserMultiFactorAuthRepository } from '../../pages/backoffice/multi-factor-auth/repositories/b2c-mp-user-multi-factor-auth-repository';
import { B2bMpUserMultiFactorAuthRepository } from '../../pages/backoffice/multi-factor-auth/repositories/b2b-mp-user-multi-factor-auth-repository';
import { B2bSspAssetRepository } from '../../pages/yves/ssp-asset/repositories/b2b-ssp-asset-repository';
import { SuiteSspDashboardManagementRepository } from '../../pages/yves/ssp-dashboard-management/repositories/suite-ssp-dashboard-management-repository';
import { B2bMpSspDashboardManagementRepository } from '../../pages/yves/ssp-dashboard-management/repositories/b2b-mp-ssp-dashboard-management-repository';
import { B2bSspDashboardManagementRepository } from '../../pages/yves/ssp-dashboard-management/repositories/b2b-ssp-dashboard-management-repository';

type BindingsMap = { [K in REPOSITORIES]?: interfaces.Newable<unknown> };

const suiteMappings: BindingsMap = {
  [REPOSITORIES.YvesRepository]: SuiteYvesRepository,
  [REPOSITORIES.HomeRepository]: SuiteHomeRepository,
  [REPOSITORIES.MultiFactorAuthRepository]: SuiteMultiFactorAuthRepository,
  [REPOSITORIES.LoginRepository]: SuiteLoginRepository,
  [REPOSITORIES.CartRepository]: SuiteCartRepository,
  [REPOSITORIES.MultiCartRepository]: SuiteMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: SuiteCommentCartRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: SuiteCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutAddressRepository]: SuiteCheckoutAddressRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: SuiteCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: SuiteCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: SuiteCheckoutSummaryRepository,
  [REPOSITORIES.AgentLoginRepository]: SuiteAgentLoginRepository,
  [REPOSITORIES.CatalogRepository]: SuiteCatalogRepository,
  [REPOSITORIES.ProductRepository]: SuiteProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: SuiteCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: SuiteMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: SuiteMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: SuiteMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: SuiteMerchantRepository,
  [REPOSITORIES.CustomerOverviewRepository]: SuiteCustomerOverviewRepository,
  [REPOSITORIES.ContentRepository]: SuiteContentRepository,
  [REPOSITORIES.OrderDetailsRepository]: SuiteOrderDetailsRepository,
  [REPOSITORIES.ProductComparisonRepository]: SuiteProductComparisonRepository,
  [REPOSITORIES.ManageCompanyRoleUserRepository]: SuiteManageCompanyRoleUserRepository,
  [REPOSITORIES.SspInquiryRepository]: SuiteSspInquiryRepository,
  [REPOSITORIES.SspServiceRepository]: SuiteSspServiceRepository,
  [REPOSITORIES.CompanyRoleIndexRepository]: SuiteCompanyRoleIndexRepository,
  [REPOSITORIES.CompanyRoleCreateRepository]: SuiteCompanyRoleCreateRepository,
  [REPOSITORIES.CustomerDeleteRepository]: SuiteCustomerDeleteRepository,
  [REPOSITORIES.CustomerProfileRepository]: SuiteCustomerProfileRepository,
  [REPOSITORIES.SspAssetRepository]: SuiteSspAssetRepository,
  [REPOSITORIES.AgentMultiFactorAuthRepository]: SuiteAgentMultiFactorAuthRepository,
  [REPOSITORIES.UserMultiFactorAuthRepository]: SuiteUserMultiFactorAuthRepository,
  [REPOSITORIES.SspDashboardManagementRepository]: SuiteSspDashboardManagementRepository,
};

const b2cMappings: BindingsMap = {
  [REPOSITORIES.YvesRepository]: B2cYvesRepository,
  [REPOSITORIES.HomeRepository]: B2cHomeRepository,
  [REPOSITORIES.MultiFactorAuthRepository]: B2cMultiFactorAuthRepository,
  [REPOSITORIES.LoginRepository]: B2cLoginRepository,
  [REPOSITORIES.CartRepository]: B2cCartRepository,
  [REPOSITORIES.MultiCartRepository]: B2cMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: B2cCommentCartRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: B2cCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutAddressRepository]: B2cCheckoutAddressRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: B2cCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: B2cCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: B2cCheckoutSummaryRepository,
  [REPOSITORIES.AgentLoginRepository]: B2cAgentLoginRepository,
  [REPOSITORIES.CatalogRepository]: B2cCatalogRepository,
  [REPOSITORIES.ProductRepository]: B2cProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: B2cCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: B2cMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: B2cMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: B2cMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: B2cMerchantRepository,
  [REPOSITORIES.CustomerOverviewRepository]: B2cCustomerOverviewRepository,
  [REPOSITORIES.OrderDetailsRepository]: B2cOrderDetailsRepository,
  [REPOSITORIES.ContentRepository]: B2cContentRepository,
  [REPOSITORIES.ProductComparisonRepository]: B2cProductComparisonRepository,
  [REPOSITORIES.CompanyRoleIndexRepository]: B2cCompanyRoleIndexRepository,
  [REPOSITORIES.CompanyRoleCreateRepository]: B2cCompanyRoleCreateRepository,
  [REPOSITORIES.ManageCompanyRoleUserRepository]: B2cManageCompanyRoleUserRepository,
  [REPOSITORIES.CustomerDeleteRepository]: B2cCustomerDeleteRepository,
  [REPOSITORIES.CustomerProfileRepository]: B2cCustomerProfileRepository,
  [REPOSITORIES.AgentMultiFactorAuthRepository]: B2cAgentMultiFactorAuthRepository,
  [REPOSITORIES.UserMultiFactorAuthRepository]: B2cUserMultiFactorAuthRepository,
};

const b2bMappings: BindingsMap = {
  [REPOSITORIES.YvesRepository]: B2bYvesRepository,
  [REPOSITORIES.HomeRepository]: B2bHomeRepository,
  [REPOSITORIES.MultiFactorAuthRepository]: B2bMultiFactorAuthRepository,
  [REPOSITORIES.LoginRepository]: B2bLoginRepository,
  [REPOSITORIES.CartRepository]: B2bCartRepository,
  [REPOSITORIES.MultiCartRepository]: B2bMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: B2bCommentCartRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: B2bCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutAddressRepository]: B2bCheckoutAddressRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: B2bCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: B2bCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: B2bCheckoutSummaryRepository,
  [REPOSITORIES.AgentLoginRepository]: B2bAgentLoginRepository,
  [REPOSITORIES.CatalogRepository]: B2bCatalogRepository,
  [REPOSITORIES.ProductRepository]: B2bProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: B2bCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: B2bMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: B2bMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: B2bMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: B2bMerchantRepository,
  [REPOSITORIES.CustomerOverviewRepository]: B2bCustomerOverviewRepository,
  [REPOSITORIES.OrderDetailsRepository]: B2bOrderDetailsRepository,
  [REPOSITORIES.ContentRepository]: B2bContentRepository,
  [REPOSITORIES.ProductComparisonRepository]: B2bProductComparisonRepository,
  [REPOSITORIES.ManageCompanyRoleUserRepository]: B2bManageCompanyRoleUserRepository,
  [REPOSITORIES.CompanyRoleIndexRepository]: B2bCompanyRoleIndexRepository,
  [REPOSITORIES.CompanyRoleCreateRepository]: B2bCompanyRoleCreateRepository,
  [REPOSITORIES.CustomerDeleteRepository]: B2bCustomerDeleteRepository,
  [REPOSITORIES.CustomerProfileRepository]: B2bCustomerProfileRepository,
  [REPOSITORIES.AgentMultiFactorAuthRepository]: B2bAgentMultiFactorAuthRepository,
  [REPOSITORIES.UserMultiFactorAuthRepository]: B2bUserMultiFactorAuthRepository,
  [REPOSITORIES.SspAssetRepository]: B2bSspAssetRepository,
  [REPOSITORIES.SspInquiryRepository]: B2bSspInquiryRepository,
  [REPOSITORIES.SspDashboardManagementRepository]: B2bSspDashboardManagementRepository,
  [REPOSITORIES.SspServiceRepository]: B2bSspServiceRepository,
};

const b2cMpMappings: BindingsMap = {
  [REPOSITORIES.YvesRepository]: B2cMpYvesRepository,
  [REPOSITORIES.HomeRepository]: B2cMpHomeRepository,
  [REPOSITORIES.MultiFactorAuthRepository]: B2cMpMultiFactorAuthRepository,
  [REPOSITORIES.LoginRepository]: B2cMpLoginRepository,
  [REPOSITORIES.CartRepository]: B2cMpCartRepository,
  [REPOSITORIES.MultiCartRepository]: B2cMpMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: B2cMpCommentCartRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: B2cMpCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutAddressRepository]: B2cMpCheckoutAddressRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: B2cMpCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: B2cMpCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: B2cMpCheckoutSummaryRepository,
  [REPOSITORIES.AgentLoginRepository]: B2cMpAgentLoginRepository,
  [REPOSITORIES.CatalogRepository]: B2cMpCatalogRepository,
  [REPOSITORIES.ProductRepository]: B2cMpProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: B2cMpCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: B2cMpMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: B2cMpMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: B2cMpMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: B2cMpMerchantRepository,
  [REPOSITORIES.CustomerOverviewRepository]: B2cMpCustomerOverviewRepository,
  [REPOSITORIES.OrderDetailsRepository]: B2cMpOrderDetailsRepository,
  [REPOSITORIES.ContentRepository]: B2cMpContentRepository,
  [REPOSITORIES.ProductComparisonRepository]: B2cMpProductComparisonRepository,
  [REPOSITORIES.CompanyRoleIndexRepository]: B2cMpCompanyRoleIndexRepository,
  [REPOSITORIES.CompanyRoleCreateRepository]: B2cMpCompanyRoleCreateRepository,
  [REPOSITORIES.ManageCompanyRoleUserRepository]: B2cMpManageCompanyRoleUserRepository,
  [REPOSITORIES.CustomerDeleteRepository]: B2cMpCustomerDeleteRepository,
  [REPOSITORIES.CustomerProfileRepository]: B2cMpCustomerProfileRepository,
  [REPOSITORIES.AgentMultiFactorAuthRepository]: B2cMpAgentMultiFactorAuthRepository,
  [REPOSITORIES.UserMultiFactorAuthRepository]: B2cMpUserMultiFactorAuthRepository,
};

const b2bMpMappings: BindingsMap = {
  [REPOSITORIES.YvesRepository]: B2bMpYvesRepository,
  [REPOSITORIES.HomeRepository]: B2bMpHomeRepository,
  [REPOSITORIES.MultiFactorAuthRepository]: B2bMpMultiFactorAuthRepository,
  [REPOSITORIES.LoginRepository]: B2bMpLoginRepository,
  [REPOSITORIES.CartRepository]: B2bMpCartRepository,
  [REPOSITORIES.MultiCartRepository]: B2bMpMultiCartRepository,
  [REPOSITORIES.CommentCartRepository]: B2bMpCommentCartRepository,
  [REPOSITORIES.CheckoutCustomerRepository]: B2bMpCheckoutCustomerRepository,
  [REPOSITORIES.CheckoutAddressRepository]: B2bMpCheckoutAddressRepository,
  [REPOSITORIES.CheckoutShipmentRepository]: B2bMpCheckoutShipmentRepository,
  [REPOSITORIES.CheckoutPaymentRepository]: B2bMpCheckoutPaymentRepository,
  [REPOSITORIES.CheckoutSummaryRepository]: B2bMpCheckoutSummaryRepository,
  [REPOSITORIES.AgentLoginRepository]: B2bMpAgentLoginRepository,
  [REPOSITORIES.CatalogRepository]: B2bMpCatalogRepository,
  [REPOSITORIES.ProductRepository]: B2bMpProductRepository,
  [REPOSITORIES.CompanyUserSelectRepository]: B2bMpCompanyUserSelectRepository,
  [REPOSITORIES.MerchantRelationRequestCreateRepository]: B2bMpMerchantRelationRequestCreateRepository,
  [REPOSITORIES.MerchantRelationRequestDetailsRepository]: B2bMpMerchantRelationRequestDetailsRepository,
  [REPOSITORIES.MerchantRelationRequestIndexRepository]: B2bMpMerchantRelationRequestIndexRepository,
  [REPOSITORIES.MerchantRepository]: B2bMpMerchantRepository,
  [REPOSITORIES.CustomerOverviewRepository]: B2bMpCustomerOverviewRepository,
  [REPOSITORIES.OrderDetailsRepository]: B2bMpOrderDetailsRepository,
  [REPOSITORIES.ContentRepository]: B2bMpContentRepository,
  [REPOSITORIES.ProductComparisonRepository]: B2bMpProductComparisonRepository,
  [REPOSITORIES.ManageCompanyRoleUserRepository]: B2bMpManageCompanyRoleUserRepository,
  [REPOSITORIES.CompanyRoleIndexRepository]: B2bMpCompanyRoleIndexRepository,
  [REPOSITORIES.CompanyRoleCreateRepository]: B2bMpCompanyRoleCreateRepository,
  [REPOSITORIES.SspInquiryRepository]: B2bMpSspInquiryRepository,
  [REPOSITORIES.CustomerDeleteRepository]: B2bMpCustomerDeleteRepository,
  [REPOSITORIES.CustomerProfileRepository]: B2bMpCustomerProfileRepository,
  [REPOSITORIES.AgentMultiFactorAuthRepository]: B2bMpAgentMultiFactorAuthRepository,
  [REPOSITORIES.UserMultiFactorAuthRepository]: B2bMpUserMultiFactorAuthRepository,
  [REPOSITORIES.SspDashboardManagementRepository]: B2bMpSspDashboardManagementRepository,
  [REPOSITORIES.SspServiceRepository]: B2bMpSspServiceRepository,
};

const mappings = {
  suite: suiteMappings,
  b2c: b2cMappings,
  b2b: b2bMappings,
  'b2c-mp': b2cMpMappings,
  'b2b-mp': b2bMpMappings,
};

const container = new Container();
applyRepositoryBindings(mappings[Cypress.env('repositoryId') as keyof typeof mappings]);

function applyRepositoryBindings(bindings: BindingsMap): void {
  for (const [type, implementation] of Object.entries(bindings)) {
    container.bind(type).to(implementation);
  }
}

export { container };
