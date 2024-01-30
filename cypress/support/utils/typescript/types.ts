/* eslint-disable @typescript-eslint/no-unused-vars */
type Customer = {
  email: string;
  password: string;
};

type User = {
  username: string;
  password: string;
};

type MerchantUser = {
  username: string;
  firstName: string;
  lastName: string;
  user?: User;
};

type Merchant = {
  name: string;
  reference: string;
  email: string;
  url: string;
};

type Guest = {
  firstName: string;
  lastName: string;
  email: string;
};

type CheckoutAddress = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  company: string;
  phone: string;
};

type CustomerGuestForm = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

type CustomerRegistration = {
  email: string;
  password: string;
  salutation: string;
  firstName: string;
  lastName: string;
};
