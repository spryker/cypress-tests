import { User } from './shared';

export interface WorkflowManagementStaticFixtures {
  defaultPassword: string;
  subjectType: string;
  triggerEventLabel: string;
  otherSubjectTypeTriggerEventLabel: string;
  initialState: string;
  definitionTemplate: string;
}

export interface WorkflowManagementDynamicFixtures {
  rootUser: User;
}
