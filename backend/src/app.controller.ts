import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      name: 'The Tree Health Project API',
      version: '0.1.0',
      docs: '/api/health',
    };
  }
}
