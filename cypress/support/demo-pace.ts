// Slows a run down for demo recordings: a pause before every user action and after every test,
// typing at a visible speed, and the Symfony debug toolbar of a dev stack collapsed. Active only when the `demoDelay` env (milliseconds) is set.
const PAUSED_ACTIONS = ['click', 'select', 'check', 'uncheck', 'clear'];
const TYPING_DELAY = 60;
const SYMFONY_TOOLBAR_STATE_KEY = 'symfony/profiler/toolbar/displayState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OriginalCommand = (...args: any[]) => unknown;

const pause = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds));

// Cypress types allow no Promise as the result of an overwritten command; the runtime awaits it.
const overwrite = Cypress.Commands.overwrite.bind(Cypress.Commands) as unknown as (
  name: string,
  fn: (originalFn: OriginalCommand, ...args: unknown[]) => unknown
) => void;

export const registerDemoPace = (): void => {
  const delay = Number(Cypress.env('demoDelay') ?? 0);

  if (!delay) {
    return;
  }

  PAUSED_ACTIONS.forEach((action) => {
    overwrite(action, (originalFn, ...args) => pause(delay).then(() => originalFn(...args)));
  });

  overwrite('type', (originalFn, subject, text, options) =>
    pause(delay).then(() => originalFn(subject, text, { delay: TYPING_DELAY, ...(options as object) }))
  );

  Cypress.on('window:before:load', (window) => {
    window.localStorage.setItem(SYMFONY_TOOLBAR_STATE_KEY, 'none');
  });

  afterEach(() => {
    cy.wait(delay * 2, { log: false });
  });
};
