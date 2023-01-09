/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';
export default registerAs('mongo_db', () => {
  // return process.env.npm_lifecycle_event !== 'dev'
  //   ? {
  //       uri: `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABSE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  //       ssl: true,
  //       sslValidate: false,
  //       sslCA:`./${process.env.SSLCA}`,
  //       useNewUrlParser:true,
  //       retryWrites:false
  //     }
  //   : {
  //       uri: `mongodb://${process.env.DATABSE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  //     };
  return {
    uri: `mongodb://${process.env.DATABSE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  };
});
