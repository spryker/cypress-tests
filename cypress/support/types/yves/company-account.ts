import { Customer, CompanyBusinessUnit, CompanyRole, CompanyUser, User } from './shared';

export interface CompanyRoleDynamicFixtures {
  customer: Customer;
  user: User;
  companyRole: CompanyRole;
  companyUser: CompanyUser;
}

export interface CompanyRoleStaticFixtures {
  defaultPassword: string;
}

export interface CompanyUserInvitationStaticFixtures {
  defaultPassword: string;
  invitationStatusNotSent: string;
  invitationStatusPending: string;
  excelCsvMimeType: string;
  invitationSentMessage: string;
  invitationResentMessage: string;
  invitationDeletedMessage: string;
  invalidFileMessage: string;
}

export interface CompanyUserInvitationDynamicFixtures {
  customer: Customer;
  businessUnit: CompanyBusinessUnit;
}
