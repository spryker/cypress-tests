import { container, skipWhenFeatureAbsent } from '@utils';
import { WorkflowManagementDynamicFixtures, WorkflowManagementStaticFixtures } from '@interfaces/backoffice';
import { UserLoginScenario } from '@scenarios/backoffice';
import { WorkflowManagementPage } from '@pages/backoffice';

describe(
  'workflow management',
  {
    tags: ['@backoffice', '@workflow', 'workflow', 'spryker-core-back-office', 'spryker-core'],
  },
  (): void => {
    // The B2C shops do not install the workflow module.
    if (['b2c', 'b2c-mp'].includes(Cypress.env('repositoryId'))) {
      it.skip('skipped because the B2C shops have no workflows', () => {});

      return;
    }

    skipWhenFeatureAbsent('workflow', ['b2b']);

    const workflowManagementPage = container.get(WorkflowManagementPage);
    const userLoginScenario = container.get(UserLoginScenario);

    let staticFixtures: WorkflowManagementStaticFixtures;
    let dynamicFixtures: WorkflowManagementDynamicFixtures;

    before((): void => {
      ({ staticFixtures, dynamicFixtures } = Cypress.env());
    });

    beforeEach((): void => {
      userLoginScenario.execute({
        username: dynamicFixtures.rootUser.username,
        password: staticFixtures.defaultPassword,
      });
    });

    it('admin should see only the triggers of the selected subject type when creating a workflow', (): void => {
      const { subjectType, triggerEventLabel, otherSubjectTypeTriggerEventLabel } = staticFixtures;

      workflowManagementPage.visitCreate();
      workflowManagementPage.getProcessTriggerEventsSelect().should('be.disabled');

      workflowManagementPage.selectSubjectType(subjectType);

      workflowManagementPage.getProcessTriggerEventsSelect().should('not.be.disabled');
      workflowManagementPage.getProcessTriggerEventsSelect().find('option').should('contain', triggerEventLabel);
      workflowManagementPage
        .getProcessTriggerEventsSelect()
        .find('option')
        .should('not.contain', otherSubjectTypeTriggerEventLabel);
    });

    it('admin should be able to create and activate a workflow with a trigger', (): void => {
      const { subjectType, triggerEventLabel, initialState } = staticFixtures;

      const workflowName = `E2E Onboarding ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

      const definition = staticFixtures.definitionTemplate.replace('%process_name%', workflowName);

      workflowManagementPage.createWorkflow({
        name: workflowName,
        subjectType,
        triggerEventLabel,
        initialState,
        definition,
      });
      workflowManagementPage.getProcessRow(workflowName).should('exist');
      workflowManagementPage.getProcessRowActiveVersion(workflowName).invoke('text').invoke('trim').should('eq', '-');

      workflowManagementPage.activateFirstVersion(workflowName);

      workflowManagementPage.visit();
      workflowManagementPage.activateProcess(workflowName);

      // The overview table reflects the active version, active status and trigger summary.
      // Anchored, and not `contain`: the label is translated, and "Inactive" contains "active", so a substring
      // check passes on a workflow that never activated — which is exactly how this went unnoticed.
      workflowManagementPage
        .getProcessRowStatus(workflowName)
        .invoke('text')
        .invoke('trim')
        .should('match', /^active$/i);
      workflowManagementPage.getProcessRowActiveVersion(workflowName).invoke('text').invoke('trim').should('eq', 'V1');
      workflowManagementPage.getProcessRowTriggers(workflowName).should('contain', triggerEventLabel);
    });
  }
);
