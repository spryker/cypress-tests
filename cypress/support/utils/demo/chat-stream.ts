const STREAM_DONE_SENTINEL = '[DONE]';

export function buildChatStreamBody(
  events: Array<Record<string, unknown>>,
  options: { isTerminated?: boolean } = {}
): string {
  const lines = events.map((event) => JSON.stringify(event));

  return [...lines, ...(options.isTerminated === false ? [] : [STREAM_DONE_SENTINEL])]
    .map((line) => `data: ${line}\n\n`)
    .join('');
}

export function readChatRequestBody(body: unknown): Record<string, unknown> {
  return typeof body === 'string' ? JSON.parse(body) : (body as Record<string, unknown>);
}
