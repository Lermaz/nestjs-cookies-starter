import { ApiProperty } from '@nestjs/swagger';

export class Token {
  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly refreshToken: string;
}
export interface IToken extends Token {
  accessToken: string;
  refreshToken: string;
}
