import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Put } from '@nestjs/common';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('save')
  @ApiResponse({
    status: 200,
    description: 'Save user',
  })
  @ApiOperation({ summary: ' Save User' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      createUserDto.email = createUserDto.email.toLowerCase();
      await this.usersService.create(createUserDto);
      return { status: 200, message: 'User created' };
    } catch (error) {
      Logger.error('userController/save', error);
      return new BadRequestException(error);
    }
  }

  @Get('list')
  @ApiResponse({
    status: 200,
    description: 'Obtaining user catalog',
  })
  @ApiOperation({ summary: 'Check the list of users' })
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return users;
    } catch (error) {
      Logger.error('userController/findAll', error);
      return new BadRequestException(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Query a user' })
  @ApiResponse({
    status: 200,
    description: 'Get a user by id',
  })
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      return user;
    } catch (error) {
      Logger.error('userController/findOne', error);
      return new BadRequestException(error);
    }
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Update user',
  })
  @ApiOperation({ summary: 'Update user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return updatedUser;
    } catch (error) {
      Logger.error('userController/update', error);
      return new BadRequestException(error);
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete user',
  })
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return 'User deleted';
    } catch (error) {
      Logger.error('userController/remove', error);
      return new BadRequestException(error);
    }
  }
}
