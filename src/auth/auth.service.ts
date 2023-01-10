import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { IToken } from './interfaces/token.interface';
import { Logger } from '@nestjs/common';
import { PasswordService } from './password.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UsersService,
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<IRefreshToken>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    return null;
  }

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

      res.cookie('token', tokens, {
        httpOnly: true,
      });

      const refreshToken = new this.refreshTokenModel({
        refreshToken: tokens.refreshToken,
        userId: user.id,
      });
      await refreshToken.save();

      return user;
    } catch (error) {
      Logger.error('login', error);
      throw new BadRequestException(error);
    }
  }

  async refreshToken({ refreshToken }: IToken, res: Response): Promise<IToken> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.JWT_ACCESS_SECRET,
        });
        // const refresh = this.refreshTokenModel.findOne({
        //   userId: userId,
        // });

        // if (!refresh) {
        //   throw new UnauthorizedException();
        // }

        const tokens = await this.generateTokens({
          userId,
        });

        // res.clearCookie('token');
        res.cookie('token', tokens, {
          httpOnly: true,
        });
        resolve(tokens);
      } catch (error) {
        reject(error);
      }
    });
  }

  async logout(id: string, res: Response) {
    try {
      await res.clearCookie('token');
    } catch (error) {
      Logger.error('login', error);
      throw new BadRequestException(error);
    }
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
