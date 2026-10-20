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

      const workflowName = createWorkflowName();

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

      workflowManagementPage.deactivateProcess(workflowName);

      workflowManagementPage
        .getProcessRowStatus(workflowName)
        .invoke('text')
        .invoke('trim')
        .should('match', /^inactive$/i);
    });

    it('admin should share one event between transitions that use the same event name', (): void => {
      const { subjectType, triggerEventLabel, initialState, sharedEventName, secondEventName, validTimeout } =
        staticFixtures;
      const workflowName = createWorkflowName();

      workflowManagementPage.fillCreateForm({
        name: workflowName,
        subjectType,
        triggerEventLabel,
        initialState,
        definition: createDefinitionWithTimeout(workflowName, validTimeout),
      });

      workflowManagementPage.selectCanvasTransition(sharedEventName);
      workflowManagementPage.getEventSharedHint().should('not.be.visible');

      workflowManagementPage.renameCanvasTransitionEvent({
        currentEventName: secondEventName,
        newEventName: sharedEventName,
      });

      workflowManagementPage.getEventSharedHint().should('be.visible');
      workflowManagementPage.getEventTransitionCount().should('have.text', '2');
    });

    it('admin should not be able to create a workflow from an invalid definition', (): void => {
      const {
        subjectType,
        triggerEventLabel,
        initialState,
        invalidTimeout,
        duplicateStateName,
        secondStateName,
        duplicateStateNameMessage,
      } = staticFixtures;
      const workflowName = createWorkflowName();

      workflowManagementPage.fillCreateForm({
        name: workflowName,
        subjectType,
        triggerEventLabel,
        initialState,
        definition: createDefinitionWithTimeout(workflowName, invalidTimeout),
      });

      workflowManagementPage.renameCanvasState({ currentName: secondStateName, newName: duplicateStateName });
      workflowManagementPage.getStateNameInput().should('have.class', 'is-invalid');
      workflowManagementPage.submitCreateForm();

      cy.location('pathname').should('eq', '/workflow/process/create');
      workflowManagementPage.getDefinitionValidationResult().should('contain', duplicateStateNameMessage);

      workflowManagementPage.getStateNameInput().clear().type(secondStateName);
      workflowManagementPage.getStateNameInput().should('not.have.class', 'is-invalid');
      workflowManagementPage.submitCreateForm();

      workflowManagementPage.getProcessForm().should('contain', invalidTimeout);

      workflowManagementPage.visit();
      workflowManagementPage.getProcessRow(workflowName).should('not.exist');
    });

    it('admin should be able to create, describe and activate a new version of a workflow', (): void => {
      const { subjectType, triggerEventLabel, initialState, duplicateStateName, renamedStateName, updatedDescription } =
        staticFixtures;
      const workflowName = createWorkflowName();

      workflowManagementPage.createWorkflow({
        name: workflowName,
        subjectType,
        triggerEventLabel,
        initialState,
        definition: staticFixtures.definitionTemplate.replace('%process_name%', workflowName),
      });
      workflowManagementPage.activateFirstVersion(workflowName);

      workflowManagementPage.openNewVersion();
      workflowManagementPage.getVersionSource().should('contain', staticFixtures.sourceVersionText);
      workflowManagementPage.renameCanvasState({ currentName: duplicateStateName, newName: renamedStateName });
      workflowManagementPage.saveVersion();

      cy.location('pathname').should('eq', '/workflow/version/view');
      workflowManagementPage.getCanvas().should('contain', renamedStateName);

      workflowManagementPage.saveProcessDescription(updatedDescription);
      workflowManagementPage.getSummaryDescription().should('contain', updatedDescription);

      workflowManagementPage.activateLatestVersion();
      workflowManagementPage.getActiveVersionNumber().invoke('text').invoke('trim').should('eq', 'V2');

      workflowManagementPage.visit();
      workflowManagementPage.getProcessRowActiveVersion(workflowName).invoke('text').invoke('trim').should('eq', 'V2');
    });

    function createWorkflowName(): string {
      return `E2E Onboarding ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    }

    function createDefinitionWithTimeout(workflowName: string, timeout: string): string {
      return staticFixtures.timeoutDefinitionTemplate
        .replace('%process_name%', workflowName)
        .replace('%timeout%', timeout);
    }
  }
);
