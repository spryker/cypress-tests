// The proof of work runs at the lowered Cypress-environment cost and solves in well under a second headless;
// the margin only absorbs slow CI runners.
export const CAPTCHA_VERIFICATION_TIMEOUT = 20000;

interface AltchaPayload {
  solution: {
    counter: number;
  };
}

// The ALTCHA widget submits base64(JSON { challenge, solution: { counter, derivedKey, time } }). Bumping the
// counter keeps the payload well formed and the challenge signature intact, but the proof of work no longer
// matches it, so the server must reject it during verification rather than while parsing it.
export function tamperAltchaPayload(payload: string): string {
  const decodedPayload: AltchaPayload = JSON.parse(atob(payload));
  decodedPayload.solution.counter += 1;

  return btoa(JSON.stringify(decodedPayload));
}
