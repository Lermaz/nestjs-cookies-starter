import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'The name is required' })
  @ApiProperty({ description: 'Name of the user' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'The emial is required' })
  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'The password is required' })
  @ApiProperty({ description: 'Password of the user' })
  password: string;
}
