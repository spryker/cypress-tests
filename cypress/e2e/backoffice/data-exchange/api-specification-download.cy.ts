import { container } from '@utils';
import {
  ApiSpecificationDownloadDynamicFixtures,
  ApiSpecificationDownloadStaticFixtures,
} from '@interfaces/backoffice';
import { DataExchangePage, FieldDefinition } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// spy_mime_type is a core table with no configuration in demo data, so exposing it is observable
// as a resource the specification gained. Its alias is derived by the configuration mapper:
// the spy_ prefix is dropped, underscores become dashes and the name is pluralised.
const TABLE_NAME = 'spy_mime_type';
const RESOURCE_PATH = '/mime-types';

// A resource demo data already exposes, so the very first download proves the file is the real
// specification and not an empty placeholder.
const ALREADY_EXPOSED_RESOURCE_PATH = '/dynamic-entity/product-abstracts';

const FIELD_DEFINITIONS: Array<FieldDefinition> = [
  { name: 'id_mime_type', type: 'integer', isCreatable: true, isEditable: false, isRequired: false },
  { name: 'comment', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'extensions', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'is_allowed', type: 'boolean', isCreatable: true, isEditable: true, isRequired: true },
  { name: 'name', type: 'string', isCreatable: true, isEditable: true, isRequired: true },
];

describe(
  'data exchange api specification download',
  { tags: ['@backoffice', 'data-exchange-api', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const dataExchangePage = container.get(DataExchangePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: ApiSpecificationDownloadStaticFixtures;
    let dynamicFixtures: ApiSpecificationDownloadDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    // Restores the state the run started from: the resource is taken back out of the specification
    // so a later run still sees it as absent before the configuration is enabled.
    after((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      dataExchangePage.openConfiguration(TABLE_NAME);
      dataExchangePage.setConfigurationEnabled(false);
      dataExchangePage.saveConfiguration();
      dataExchangePage.waitForApiSpecificationToBeCurrent();
      dataExchangePage.discardDownloadedApiSpecification();
    });

    it('given a table is not exposed when its data exchange api configuration is enabled and the specification is regenerated then the downloaded specification gains its resource', (): void => {
      // Arrange
      // The baseline is established rather than assumed. A retry re-enters the test with the
      // configuration the previous attempt enabled and its download still on disk, and the two
      // absence checks below would then fail for the wrong reason and hide what actually broke.
      dataExchangePage.discardDownloadedApiSpecification();
      dataExchangePage.openConfiguration(TABLE_NAME);
      dataExchangePage.setConfigurationEnabled(false);
      dataExchangePage.saveConfiguration();

      dataExchangePage.regenerateApiSpecification();
      dataExchangePage.waitForApiSpecificationToBeCurrent();

      dataExchangePage.getDownloadSpecificationButton().should('not.have.class', 'disabled');
      dataExchangePage.downloadApiSpecification();
      dataExchangePage
        .getDownloadedApiSpecification()
        .should('contain', ALREADY_EXPOSED_RESOURCE_PATH)
        .and('not.contain', RESOURCE_PATH);
      dataExchangePage.discardDownloadedApiSpecification();

      // Act
      dataExchangePage.openConfiguration(TABLE_NAME);
      dataExchangePage.setConfigurationEnabled(true);
      FIELD_DEFINITIONS.forEach((field: FieldDefinition): void => dataExchangePage.configureField(field));
      dataExchangePage.saveConfiguration();

      // Assert
      dataExchangePage.getErrorMessage().should('not.exist');
      dataExchangePage.visit();
      dataExchangePage.getDownloadSpecificationButton().should('have.class', 'disabled');

      dataExchangePage.waitForApiSpecificationToBeCurrent();
      dataExchangePage.downloadApiSpecification();
      dataExchangePage.getDownloadedApiSpecification().should('contain', RESOURCE_PATH);
    });
  }
);
