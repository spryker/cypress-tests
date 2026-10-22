import { User } from './shared';

export interface WorkflowManagementStaticFixtures {
  defaultPassword: string;
  subjectType: string;
  triggerEventLabel: string;
  otherSubjectType: string;
  otherSubjectTypeTriggerEventLabel: string;
  initialState: string;
  definitionTemplate: string;
  timeoutDefinitionTemplate: string;
  sharedEventName: string;
  secondEventName: string;
  invalidTimeout: string;
  validTimeout: string;
  sourceVersionText: string;
  connectedStateSourceName: string;
  addedStateName: string;
  duplicateStateName: string;
  secondStateName: string;
  duplicateStateNameMessage: string;
  renamedStateName: string;
  updatedDescription: string;
}

export interface WorkflowManagementDynamicFixtures {
  rootUser: User;
}
