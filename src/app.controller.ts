import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config:ConfigService
  ) {}

  @Get()
  getHello(): string {
    
    return this.appService.getHello();
  }
}
