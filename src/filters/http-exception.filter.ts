import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const exceptionResponse = exception.getResponse();
    const request = context.getRequest<Request>();

    const error: any = exceptionResponse;
    const status = 400;
    let message;

    if (error.errors) {
      const errorMessages = [];
      for (const key in error.errors) {
        errorMessages.push(error.errors[key].message);
      }
      message = errorMessages.join(', ');
    }
    response.status(status).json({
      status,
      response: false,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
