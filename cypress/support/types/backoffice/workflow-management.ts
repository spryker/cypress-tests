import { User } from './shared';

export interface WorkflowManagementStaticFixtures {
  defaultPassword: string;
  subjectType: string;
  triggerEventLabel: string;
  initialState: string;
  definitionTemplate: string;
}

export interface WorkflowManagementDynamicFixtures {
  rootUser: User;
}
