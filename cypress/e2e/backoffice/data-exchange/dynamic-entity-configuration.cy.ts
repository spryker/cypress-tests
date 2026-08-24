import { container } from '@utils';
import {
  DynamicEntityConfigurationDynamicFixtures,
  DynamicEntityConfigurationStaticFixtures,
} from '@interfaces/backoffice';
import { DataExchangePage, FieldDefinition } from '@pages/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';

// spy_mime_type carries one column of every type the form offers a choice for, so configuring it
// exercises the integer, string and boolean branches of the field-definition table in one pass.
const TABLE_NAME = 'spy_mime_type';

const FIELD_DEFINITIONS: Array<FieldDefinition> = [
  { name: 'id_mime_type', type: 'integer', isCreatable: true, isEditable: false, isRequired: false },
  { name: 'comment', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'extensions', type: 'string', isCreatable: true, isEditable: true, isRequired: false },
  { name: 'is_allowed', type: 'boolean', isCreatable: true, isEditable: true, isRequired: true },
  { name: 'name', type: 'string', isCreatable: true, isEditable: true, isRequired: true },
];

describe(
  'data exchange api configuration',
  { tags: ['@backoffice', 'data-exchange-api', 'spryker-core-back-office', 'spryker-core'] },
  (): void => {
    const dataExchangePage = container.get(DataExchangePage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: DynamicEntityConfigurationStaticFixtures;
    let dynamicFixtures: DynamicEntityConfigurationDynamicFixtures;

    before((): void => {
      ({ dynamicFixtures, staticFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    // Leaves the table out of the Backend API again. The configuration row itself stays, because
    // deleting it is a database operation Cypress has no route to, and an enabled leftover would
    // change what every other specification-facing test sees.
    after((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });

      dataExchangePage.openConfiguration(TABLE_NAME);
      dataExchangePage.setConfigurationEnabled(false);
      dataExchangePage.saveConfiguration();
    });

    it('given a data exchange api configuration for a table when its resource fields are configured and saved then the reloaded form renders back what was saved', (): void => {
      // Arrange
      // The visible names are the witness that this run wrote the definition: every other value in
      // the form is one a previous run could have left behind, and asserting those alone would pass
      // against untouched state.
      const runMarker = Math.random().toString(36).substring(2, 8);
      const visibleNameOf = (field: FieldDefinition): string => `${field.name}_${runMarker}`;

      dataExchangePage.openConfiguration(TABLE_NAME);

      // Act
      dataExchangePage.setConfigurationEnabled(true);
      FIELD_DEFINITIONS.forEach((field: FieldDefinition): void =>
        dataExchangePage.configureField(field, visibleNameOf(field))
      );
      dataExchangePage.saveConfiguration();

      // Assert
      dataExchangePage.getConfigurationSavedMessage().should('be.visible');
      dataExchangePage.getErrorMessage().should('not.exist');

      dataExchangePage.openConfiguration(TABLE_NAME);
      dataExchangePage.getIsEnabledCheckbox().should('be.checked');

      FIELD_DEFINITIONS.forEach((field: FieldDefinition): void => {
        dataExchangePage.getFieldControl(field.name, 'enabled').should('be.checked');
        dataExchangePage.getFieldControl(field.name, 'visibleName').should('have.value', visibleNameOf(field));
        dataExchangePage.getFieldControl(field.name, 'type').should('have.value', field.type);
        assertToggle(field.name, 'creatable', field.isCreatable);
        assertToggle(field.name, 'editable', field.isEditable);
        assertToggle(field.name, 'required', field.isRequired);
      });

      function assertToggle(
        fieldName: string,
        control: 'creatable' | 'editable' | 'required',
        expected: boolean
      ): void {
        dataExchangePage.getFieldControl(fieldName, control).should(expected ? 'be.checked' : 'not.be.checked');
      }
    });
  }
);
