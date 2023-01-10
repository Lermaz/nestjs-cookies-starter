import { UserSchema, UserTable } from './schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordService } from 'src/auth/password.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserTable, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordService, JwtService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
