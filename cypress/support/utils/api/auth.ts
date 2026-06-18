/**
 * Builds the JSON + Bearer headers shared by the authenticated Glue API tests.
 */
export function authHeaders(accessToken: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}
