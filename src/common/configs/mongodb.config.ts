/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
export default registerAs('mongo_db', () => {
  return {
    uri: `mongodb://${process.env.DATABSE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  };
});
