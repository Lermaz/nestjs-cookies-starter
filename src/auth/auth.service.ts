import { LoginDto } from './dto/login.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IToken } from './interfaces/token.interface';
import { Logger } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    try {
      const { email, password } = loginDto;

      const user = await this.userService.Model.findOne({ email });
      if (!user) {
        throw new Error('Wrong credentials');
      }
      await this.passwordService.validatePassword(password, user.password);
      const tokens = await this.generateTokens({
        userId: user.id,
      });

      res.cookie('auth-cookie', tokens, { httpOnly: true });
      return { user, tokens };
    } catch (error) {
      Logger.error('login', error);
      throw new BadRequestException(error);
    }
  }

  refreshToken(token: string): Promise<IToken> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
        const response = await this.generateTokens({
          userId,
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  public generateTokens(payload: { userId: string }): Promise<IToken> {
    return new Promise(async (resolve, reject) => {
      try {
        const response: IToken = {
          accessToken: await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_EXP,
          }),
          refreshToken: await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_EXP,
          }),
        };
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }
}
