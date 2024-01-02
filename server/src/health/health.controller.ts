import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import safeStringify from 'fast-safe-stringify';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get('')
  async check() {
    return { ok: 'I feel good.' };
  }

  @Get('req')
  req(@Req() req: Request) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>FeedZback</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <pre>Protocol: ${safeStringify(req.protocol, undefined, 2)}</pre>
    <pre>Headers ${safeStringify(req.headers, undefined, 2)}</pre>
    <pre>Request ${safeStringify(req, undefined, 2)}</pre>
  </body>
</html>`;
  }
}
