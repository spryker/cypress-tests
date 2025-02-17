import { Customer, File } from './shared';

export interface SspFileManagementDynamicFixtures {
    customer: Customer;
    file1: File;
    file2: File;
    file3: File;
}

export interface SspFileManagementStaticFixtures {
    defaultPassword: string;
    filter_type_file: string;
    filter_value_pdf: string;
    filter_value_jpeg: string;
    prompt_img: string;
    prompt_doc: string;
    prompt_nonexistent: string;
}
