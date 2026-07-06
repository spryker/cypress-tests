import { container } from '@utils';
import { FileDirectoryCreateDynamicFixtures, FileDirectoryCreateStaticFixtures } from '@interfaces/backoffice';
import { FileManagerPage } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// Mirror of \Spryker\Zed\FileManagerGui\Communication\Form\FileDirectoryForm::FIELD_NAME_MAX_LENGTH
// and FileDirectoryLocalizedAttributesForm::FIELD_TITLE_MAX_LENGTH.
const FIELD_MAX_LENGTH = 255;

describe(
  'file directory create',
  { tags: ['@backoffice', 'file-manager', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const fileManagerPage = container.get(FileManagerPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: FileDirectoryCreateStaticFixtures;
    let dynamicFixtures: FileDirectoryCreateDynamicFixtures;

    // The valid-name case creates a real directory, so its name is made run-unique to
    // keep repeated CI runs from colliding. The Codeception original relied on a Propel
    // teardown to purge fixed names; Cypress has no equivalent DB access here.
    const uid = Math.random().toString(36).substring(2, 8);
    const nameOfMaxLength = `${uid}${'a'.repeat(FIELD_MAX_LENGTH)}`.substring(0, FIELD_MAX_LENGTH);
    const titleOfMaxLength = 'a'.repeat(FIELD_MAX_LENGTH);

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('should show blank-value errors when creating a directory with an empty name', (): void => {
      fileManagerPage.createDirectory('');

      fileManagerPage.assertBlankValueErrors();
    });

    it('should show max-length errors when creating a directory with an over-long name', (): void => {
      fileManagerPage.createDirectory('a'.repeat(FIELD_MAX_LENGTH + 1), 'a'.repeat(FIELD_MAX_LENGTH + 1));

      fileManagerPage.assertMaxLengthErrors();
    });

    it('should create a directory and show a success message when the name is valid', (): void => {
      fileManagerPage.createDirectory(nameOfMaxLength, titleOfMaxLength);

      fileManagerPage.assertSuccessMessage();
    });
  }
);
