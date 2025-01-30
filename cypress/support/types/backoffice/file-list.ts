import { User } from './shared';
import { File, FileAttachment } from '@interfaces/shared';

export interface FileManagerAttachmentStaticFixtures {
    defaultPassword: string;
}

export interface FileManagerAttachmentDynamicFixtures {
    file: File;
    fileAttachment: FileAttachment;
    rootUser: User;
}
