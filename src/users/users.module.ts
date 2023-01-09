import { JwtStrategy } from './../auth/strategies/jwt.strategy';
import { UserSchema, UserTable } from './schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordService } from 'src/auth/password.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserTable, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, PasswordService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
