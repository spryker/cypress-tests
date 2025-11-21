export interface MerchantRegistration {
  email: string;
  companyName: string;
  status: string;
}

export interface MerchantRegistrationManagementDynamicFixtures {
  pendingRegistration: MerchantRegistration;
  acceptedRegistration: MerchantRegistration;
  rejectedRegistration: MerchantRegistration;
}
