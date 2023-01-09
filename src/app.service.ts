import { Injectable } from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { Post } from '@nestjs/common/decorators';
import { Get } from '@nestjs/common/decorators';
import { Req } from '@nestjs/common/decorators';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Request, Response } from 'express';
import { hostname } from 'os';
import * as packageJson from '../package.json';

@Injectable()
export class AppService {
  @Get('healthcheck')
  getHealthCheck(): any {
    return {
      status: 1,
      service_name: packageJson.name,
      version: packageJson.version,
      message: 'Health check OK',
      hostname: hostname,
    };
  }

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
