// One repository id can run on shops that install different features (`b2b` runs on b2b-demo-shop and on the
// b2b lane of b2b-demo-marketplace), so a spec that needs such a feature asks the running shop for it instead
// of branching on the repository id.

const HTTP_NOT_FOUND = 404;

const CONSOLE_SUCCESS = 0;

const REQUIRED_FEATURE_ENV_KEY = 'requiredFeature';

const IS_REQUIRED_FEATURE_ABSENT_ENV_KEY = 'isRequiredFeatureAbsent';

interface Feature {
  description: string;
  isPresent: () => Cypress.Chainable<boolean>;
}

// A route of an uninstalled module answers 404, an installed one answers (or redirects to the login) without it.
// A host the shop does not deploy does not answer at all.
const isUrlServed = (url: string): Cypress.Chainable<boolean> =>
  cy
    .task<number | null>('probeUrl', url)
    .then((status: number | null): boolean => status !== null && status !== HTTP_NOT_FOUND);

const isConsoleCommandRegistered = (command: string): Cypress.Chainable<boolean> =>
  cy
    .request({
      method: 'POST',
      url: `${Cypress.env('glueBackendUrl')}/dynamic-fixtures`,
      headers: { 'Content-Type': 'application/vnd.api+json' },
      body: {
        data: {
          type: 'dynamic-fixtures',
          attributes: {
            operations: [{ type: 'cli-command', name: `console help ${command}`, key: 'consoleHelp' }],
          },
        },
      },
      timeout: 100000,
    })
    .then((response): boolean => {
      const resources = [].concat(response.body.data);

      return resources.some(
        (resource: { attributes: { data: { status_code: number } } }) =>
          resource.attributes.data.status_code === CONSOLE_SUCCESS
      );
    });

const FEATURES = {
  workflow: {
    description: 'workflow management in the back office',
    isPresent: (): Cypress.Chainable<boolean> => isUrlServed(`${Cypress.env('backofficeUrl')}/workflow/process`),
  },
  configuration: {
    description: 'configuration management in the back office',
    isPresent: (): Cypress.Chainable<boolean> => isUrlServed(`${Cypress.env('backofficeUrl')}/configuration/manage`),
  },
  marketplaceStorefront: {
    description: 'marketplace merchants on the storefront',
    isPresent: (): Cypress.Chainable<boolean> => isUrlServed(`${Cypress.env('glueUrl')}/merchants`),
  },
  productAttachments: {
    description: 'product attachments',
    isPresent: (): Cypress.Chainable<boolean> => isConsoleCommandRegistered('data:import:product-attachment'),
  },
  dateTimeConfigurator: {
    description: 'date-time product configurator',
    isPresent: (): Cypress.Chainable<boolean> =>
      isUrlServed(`${new URL(Cypress.env('backofficeUrl')).protocol}//date-time-configurator-example.spryker.local/`),
  },
} satisfies Record<string, Feature>;

export type FeatureName = keyof typeof FEATURES;

/**
 * Declares, at the top of a describe, that the spec needs a feature on the listed repository ids. The feature is
 * probed before the fixtures load, because the fixtures of an absent feature cannot be created either; when it is
 * absent, the fixtures are not loaded and every test of the spec is skipped.
 *
 * @example skipWhenFeatureAbsent('workflow', ['b2b'])
 */
export const skipWhenFeatureAbsent = (featureName: FeatureName, repositoryIds: string[]): void => {
  if (!repositoryIds.includes(Cypress.env('repositoryId'))) {
    return;
  }

  Cypress.env(REQUIRED_FEATURE_ENV_KEY, featureName);

  before(function (): void {
    if (Cypress.env(IS_REQUIRED_FEATURE_ABSENT_ENV_KEY)) {
      this.skip();
    }
  });
};

/**
 * Runs the callback unless the spec declared a feature with skipWhenFeatureAbsent() that the running shop lacks.
 */
export const whenRequiredFeaturePresent = (callback: () => void): void => {
  const featureName: FeatureName | undefined = Cypress.env(REQUIRED_FEATURE_ENV_KEY);

  if (!featureName) {
    callback();

    return;
  }

  const feature: Feature = FEATURES[featureName];

  feature.isPresent().then((isPresent: boolean): void => {
    Cypress.env(IS_REQUIRED_FEATURE_ABSENT_ENV_KEY, !isPresent);

    if (isPresent) {
      callback();

      return;
    }

    cy.task('log', `Skipping ${Cypress.spec.relative}: the shop has no ${feature.description}.`);
  });
};
