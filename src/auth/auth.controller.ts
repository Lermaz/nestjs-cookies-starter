import { LoginDto } from './dto/login.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Delete } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Param } from '@nestjs/common';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return this.authService.login(loginDto, res);
    } catch (error) {
      Logger.error('login', error);
      throw new BadRequestException(error);
    }
  }

  @Post('refreshToken')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      await this.authService.refreshToken(req.cookies.token, res);
      return 'Token Refreshed';
    } catch (error) {
      Logger.error('refresh', error);
      throw new BadRequestException(error);
    }
  }

  @Delete('logout/:id')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    try {
      const response = await this.authService.logout(id, res);
      return response;
    } catch (error) {
      Logger.error('logout', error);
      throw new BadRequestException(error);
    }
  }
}
