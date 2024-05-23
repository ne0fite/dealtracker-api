import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('/')
  getIndex() {
    return {
      status: 200,
      message: 'DealTracker - OK',
    };
  }
}
