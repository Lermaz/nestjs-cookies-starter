import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { QueryValidationPipe } from './pipes/query-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new QueryValidationPipe({ always: true }));

  app.use(cookieParser());

  // Swagger Api
  if (process.env.SWAGGER_ENABLED === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Testing cookies')
      .setDescription('Building a REST API with NestJS with cookies')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('swagger', app, document, {
      customSiteTitle: 'Mongoose Day',
    });
  }

  //Filters
  app.useGlobalFilters(new HttpExceptionFilter());
  //Interceptrors
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
