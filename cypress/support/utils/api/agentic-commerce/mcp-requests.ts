const MCP_PROTOCOL_VERSION = '2025-11-25';
const MCP_SESSION_HEADER = 'mcp-session-id';
const MCP_ACCEPT = 'application/json, text/event-stream';
const EVENT_STREAM = 'text/event-stream';

export interface McpToolResult {
  httpStatus: number;
  isError: boolean;
  status?: number;
  data?: Record<string, unknown>;
  error?: string;
}

const mcpUrl = (): string => `${Cypress.env().glueStorefrontUrl}/mcp`;

function postMcpMessage(
  accessToken: string,
  message: Record<string, unknown>,
  sessionId?: string
): Cypress.Chainable<Cypress.Response<unknown>> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Accept: MCP_ACCEPT,
  };

  if (sessionId) {
    headers['Mcp-Session-Id'] = sessionId;
    headers['Mcp-Protocol-Version'] = MCP_PROTOCOL_VERSION;
  }

  return cy.request<unknown>({
    method: 'POST',
    url: mcpUrl(),
    headers,
    body: message,
    failOnStatusCode: false,
  });
}

/**
 * A JSON-RPC answer of the MCP endpoint comes as JSON or as one server-sent event.
 */
function decodeJsonRpcBody(response: Cypress.Response<unknown>): Record<string, unknown> {
  const body = typeof response.body === 'string' ? response.body : JSON.stringify(response.body);

  if (String(response.headers['content-type'] ?? '').startsWith(EVENT_STREAM)) {
    const dataLines = body.split('\n').filter((line) => line.startsWith('data:'));

    return JSON.parse(dataLines[dataLines.length - 1].replace(/^data: ?/, ''));
  }

  return JSON.parse(body);
}

/**
 * Calls one tool the way an MCP client does: `initialize`, `notifications/initialized`, then
 * `tools/call` in that session. The tool's own answer is the JSON text of the `CallToolResult`.
 */
export function callMcpTool(
  accessToken: string,
  name: string,
  toolArguments: Record<string, unknown>
): Cypress.Chainable<McpToolResult> {
  return postMcpMessage(accessToken, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: 'cypress-agentic-commerce', version: '1.0.0' },
    },
  }).then((initializeResponse) => {
    expect(initializeResponse.status, String(initializeResponse.body)).to.equal(200);

    const sessionId = String(initializeResponse.headers[MCP_SESSION_HEADER]);

    return postMcpMessage(accessToken, { jsonrpc: '2.0', method: 'notifications/initialized' }, sessionId)
      .then(() =>
        postMcpMessage(
          accessToken,
          { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name, arguments: toolArguments } },
          sessionId
        )
      )
      .then((toolResponse): McpToolResult => {
        if (toolResponse.status !== 200) {
          return { httpStatus: toolResponse.status, isError: true };
        }

        const result = decodeJsonRpcBody(toolResponse).result as
          | { isError?: boolean; content: Array<{ text: string }> }
          | undefined;

        expect(result, String(toolResponse.body)).to.not.equal(undefined);

        return {
          httpStatus: toolResponse.status,
          isError: result?.isError === true,
          ...JSON.parse(String(result?.content[0].text)),
        };
      });
  });
}
