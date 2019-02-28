/**
 * An domain object describing each "request" that the server is handle.
 */

import { IncomingMessage, ServerResponse } from 'http';

class Request {
  constructor(
    private readonly req: IncomingMessage,
    private readonly res: ServerResponse
  ) {}

  redirect({
    statusCode = 301,
    location,
  }: {
    statusCode: 301 | 302;
    location: string;
  }) {
    this.res.writeHead(statusCode, { Location: location });
  }

  sendHtml(html: string): void {
    this.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    this.res.end(html);
  }
}
