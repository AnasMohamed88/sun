import { StandardSchemaValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { AppError } from './common/exceptions/error.handle.js';
import { UniformResInterceptor } from './common/interceptors/logging.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalInterceptors(new UniformResInterceptor())
  app.useGlobalFilters(new AppError())
  app.useGlobalPipes(new StandardSchemaValidationPipe())
  const config = app.get(ConfigService)

  await app.listen(config.get("PORT") as string);
}
await bootstrap();

console.log({});


// decrypt