import { Controller, Get } from '@nestjs/common';
import { emailBuilders } from './templates/templates.fr';

@Controller('email')
export class EmailController {
  @Get('request-feedback')
  requestFeedback() {
    return emailBuilders.buildRequestFeedback('foo@zenika.com', 'Salut', '12345').html;
  }
}
