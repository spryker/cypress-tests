const CAPTCHA_CHALLENGE_URL_PATTERN = /\/captcha\/(merchant-portal-)?challenge\?/;

export function blockNextCaptchaChallenge(): void {
  cy.intercept({ method: 'GET', url: CAPTCHA_CHALLENGE_URL_PATTERN, times: 1 }, { statusCode: 503 });
}
