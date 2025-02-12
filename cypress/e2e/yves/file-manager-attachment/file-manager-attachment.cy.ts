import { container } from '@utils';
import { CustomerLoginScenario } from '@scenarios/yves';
import { CustomerOverviewPage } from '@pages/yves';
import { FileManagerAttachmentDynamicFixtures } from '@interfaces/yves';
import { FileManagerAttachmentListPage } from '@pages/yves';
import { FileManagerAttachmentStaticFixtures } from '@interfaces/yves';

(['b2c', 'b2c-mp', 'b2b', 'b2b-mp'].includes(Cypress.env('repositoryId')) ? describe.skip : describe)(
    'File Manager Module - My Files List',
    { tags: ['@yves', '@fileManager', '@ssp'] },
    (): void => {
        const customerLoginScenario = container.get(CustomerLoginScenario);
        const customerOverviewPage = container.get(CustomerOverviewPage);
        const fileManagerAttachmentListPage = container.get(FileManagerAttachmentListPage);

        let dynamicFixtures: FileManagerAttachmentDynamicFixtures;
        let staticFixtures: FileManagerAttachmentStaticFixtures;

        before((): void => {
            ({ dynamicFixtures, staticFixtures } = Cypress.env());
        });

        beforeEach((): void => {
            customerLoginScenario.execute({
                email: dynamicFixtures.customer.email,
                password: staticFixtures.defaultPassword,
            });
        });

        it.skip('should access the My Files page from customer overview', (): void => {
            customerOverviewPage.visit();
            customerOverviewPage.clickMyFilesLink();
            fileManagerAttachmentListPage.verifyListPage();
        });

        it.skip('should display uploaded files in the list', (): void => {
            customerOverviewPage.visit();
            customerOverviewPage.clickMyFilesLink();
            fileManagerAttachmentListPage.assertFileExists('img.jpeg');
            fileManagerAttachmentListPage.assertFileExists('doc.pdf');
        });

        it.skip('should allow downloading a file', (): void => {
            customerOverviewPage.visit();
            customerOverviewPage.clickMyFilesLink();
            fileManagerAttachmentListPage.downloadFile('image1.jpeg');
            fileManagerAttachmentListPage.verifyFileDownloaded('image1.jpeg');
        });
    }
);
