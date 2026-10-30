export const CAPTCHA_VERIFICATION_TIMEOUT = 20000;

interface AltchaPayload {
  solution: {
    counter: number;
  };
}

export function tamperAltchaPayload(payload: string): string {
  const decodedPayload: AltchaPayload = JSON.parse(atob(payload));
  decodedPayload.solution.counter += 1;

  return btoa(JSON.stringify(decodedPayload));
}
