import { autoWired } from '@utils';
import { inject, injectable } from 'inversify';
import { ActionEnum, BackofficePage } from '@pages/backoffice';
import { FileManagerAttachmentListRepository } from './file-manager-attachment-list-repository';

@injectable()
@autoWired
export class FileManagerAttachmentListPage extends BackofficePage {
    @inject(FileManagerAttachmentListRepository) private repository: FileManagerAttachmentListRepository;

    protected PAGE_URL = '/file-manager-attachment/list';

    verifyListPage(): void {
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Reference');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'File Name');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Size');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Type');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Date Uploaded');
        cy.get(this.repository.getTableHeaderSelector()).should('contain', 'Actions');
    }

    update = (params: UpdateParams): void => {
        this.find({ tableUrl: '/file-manager-attachment/list/table**', searchQuery: params.query }).then(($fileRow) => {
            cy.wrap($fileRow).find(this.repository.getDropdownToggleButtonSelector()).should('exist').click();

            cy.get(this.repository.getDropdownMenuSelector())
                .find(this.repository.getEditButtonSelector())
                .should('exist')
                .click();
        });
    };

    delete = (params: UpdateParams): void => {
        this.find({ tableUrl: '/file-manager-attachment/list/table**', searchQuery: params.query }).then(($fileRow) => {
            cy.wrap($fileRow).find(this.repository.getDropdownToggleButtonSelector()).should('exist').click();

            cy.get(this.repository.getDropdownMenuSelector())
                .find(this.repository.getDeleteButtonSelector())
                .should('exist')
                .click();
        });
    };

    download = (params: UpdateParams): void => {
        this.find({ tableUrl: '/file-manager-attachment/list/table**', searchQuery: params.query }).then(($fileRow) => {
            cy.wrap($fileRow).find(this.repository.getDropdownToggleButtonSelector()).should('exist').click();

            cy.get(this.repository.getDropdownMenuSelector())
                .find(this.repository.getDownloadButtonSelector())
                .should('exist')
                .click();
        });
    };
}

interface UpdateParams {
    action: ActionEnum;
    query: string;
}
