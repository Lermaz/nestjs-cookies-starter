import { Injectable, Logger } from '@nestjs/common';
import { hashSync, compareSync } from 'bcrypt';

@Injectable()
export class PasswordService {
  bcryptSaltOrRound = 10;

  get bcryptSaltRounds(): string | number {
    const saltOrRounds = this.bcryptSaltOrRound;

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await compareSync(password, hashedPassword);
        if (!response) throw 'Wrong credentials';
        resolve(response);
      } catch (error) {
        Logger.error('passwordService/validatePassword', error);
        reject(error);
      }
    });
  }

  hashPassword(password: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await hashSync(password, this.bcryptSaltRounds);
        resolve(hashedPassword);
      } catch (error) {
        reject(error);
      }
    });
  }
}
