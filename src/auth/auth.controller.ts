import { LoginDto } from './dto/login.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IToken, Token } from './interfaces/token.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ type: Token })
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
  @ApiOkResponse({ type: Token })
  async refreshToken(@Body() { token }: RefreshTokenDto): Promise<IToken> {
    try {
      const response = await this.authService.refreshToken(token);
      return response;
    } catch (error) {}
  }
}
