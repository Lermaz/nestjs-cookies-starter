import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response {
  response: boolean;
  message: string;
  status: number;
  data;
  timestamp: string;
}
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        response: true,
        message: this.getMessage(request.method),
        status: context.switchToHttp().getResponse().statusCode,
        data,
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
        path: request.url,
      })),
    );
  }

  getMessage(methodHttp) {
    switch (methodHttp) {
      case 'POST':
        return 'A record was created with the information provided';
      case 'GET':
        return 'Records found';
      case 'PUT':
        return 'The record was updated successfully';
      case 'DELETE':
        return 'The record was deleted successfully';
    }
  }
}
