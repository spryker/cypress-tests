import { User } from './shared';
import { File, FileAttachment } from '@interfaces/shared';

export interface SspFileManagementStaticFixtures {
  defaultPassword: string;
}

export interface SspFileManagementDynamicFixtures {
  file: File;
  fileAttachment: FileAttachment;
  rootUser: User;
}
