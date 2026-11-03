export const CAPTCHA_VERIFICATION_TIMEOUT = 20000;

interface AltchaPayload {
  solution: {
    derivedKey: string;
  };
}

export function tamperAltchaPayload(payload: string): string {
  const decodedPayload: AltchaPayload = JSON.parse(atob(payload));
  const { derivedKey } = decodedPayload.solution;
  decodedPayload.solution.derivedKey = `${derivedKey.slice(0, -1)}${derivedKey.endsWith('0') ? '1' : '0'}`;

  return btoa(JSON.stringify(decodedPayload));
}
