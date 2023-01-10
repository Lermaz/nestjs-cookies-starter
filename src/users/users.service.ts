import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from 'src/auth/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly passwordService: PasswordService,
  ) {}

  get Model() {
    return this.userModel;
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await this.passwordService.hashPassword(
          createUserDto.password,
        );
        const user = new this.userModel({
          ...createUserDto,
          password: hashedPassword,
        });

        await user.save();
        Logger.log('User Created');
        resolve(user);
      } catch (error) {
        Logger.error('userService/create', error);
        reject(error);
      }
    });
  }

  async findAll(): Promise<IUser[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await this.userModel.find();
        resolve(users);
      } catch (error) {
        reject(error);
        Logger.error('userService/findAll', error);
      }
    });
  }

  async findOne(id: string): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userModel.findOne({
          _id: id,
        });
        Logger.log('User found');
        resolve(user);
      } catch (error) {
        reject(error);
        Logger.error('userService/findOne', error);
      }
    });
  }

  async findOneByEmail(email: string): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userModel.findOne({
          email: email,
        });
        Logger.log('User found');
        resolve(user);
      } catch (error) {
        reject(error);
        Logger.error('userService/findOneByEmail', error);
      }
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userModel.findByIdAndUpdate(id, updateUserDto);
        Logger.log('User updated');
        resolve(user);
      } catch (error) {
        reject(error);
        Logger.error('userService/update', error);
      }
    });
  }

  async remove(id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userModel.deleteOne({ _id: id });
        Logger.log('User deleted');
        resolve(user);
      } catch (error) {
        reject(error);
        Logger.error('userService/remove', error);
      }
    });
  }
}
