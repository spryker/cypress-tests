import { container } from '@utils';
import { UserLoginScenario } from '@scenarios/backoffice';
import { FileManagerAttachmentDynamicFixtures, FileManagerAttachmentStaticFixtures } from '@interfaces/backoffice';
import { FileManagerAttachmentListPage } from '@pages/backoffice';

describe('File Manager Module - Files List', () => {
    const userLoginScenario = container.get(UserLoginScenario);
    const fileManagerAttachmentListPage = container.get(FileManagerAttachmentListPage);
    
    let dynamicFixtures: FileManagerAttachmentDynamicFixtures;
    let staticFixtures: FileManagerAttachmentStaticFixtures;

    before((): void => {
        ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach(() => {
        userLoginScenario.execute({
            username: dynamicFixtures.rootUser.username,
            password: staticFixtures.defaultPassword,
        });
    });

    it('should access the Files List page in Backoffice', () => {
        fileManagerAttachmentListPage.visit();
        fileManagerAttachmentListPage.verifyListPage();
    });
});
