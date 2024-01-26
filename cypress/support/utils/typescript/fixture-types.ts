/* eslint-disable @typescript-eslint/no-unused-vars */
type CheckoutByGuestCustomerFixtures = {
  concreteProductSkus: string[];
};

type CheckoutByLoggedInCustomerFixtures = {
  concreteProductSkus: string[];
  customer: Customer;
};

type CartCommentFixtures = {
  concreteProductSku: string;
  comments: string[];
  customer: Customer;
};

type AgentPermissionInBackofficeFixtures = {
  user: User;
  customerAgentUser: User;
  merchantAgentUser: User;
};

type AgentLoginPageFixtures = {
  customerAgentUser: User;
  merchantAgentUser: User;
  merchantUser: User;
};

type CreateOrderByCustomerFixtures = {
  concreteProductSkus: string[];
  customer: Customer;
};

type CreateOrderByGuestFixtures = {
  concreteProductSkus: string[];
};

type CreateReturnByUserFixtures = {
  concreteProductSkus: string[];
  user: User;
};

type MerchantUsersPageFixtures = {
  merchantAgentUser: User;
  backofficeUser: User;
};
