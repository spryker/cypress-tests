import { Company, User } from './shared';

export interface WorkflowInstanceLifecycleStaticFixtures {
  defaultPassword: string;
  initialState: string;
  manualEvent: string;
  targetState: string;
}

export interface WorkflowInstanceLifecycleDynamicFixtures {
  rootUser: User;
  workflow: Workflow;
  company: Company;
}

export interface Workflow {
  id_state_machine_process: number;
  process_name: string;
  state_machine_name: string;
  subject_type: string;
}
