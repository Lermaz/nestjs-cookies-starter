import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { hostname } from 'os';
import * as packageJson from '../package.json';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('Should return json object of project info', () => {
      expect(appController.getHealthCheck()).toStrictEqual({
        status: 1,
        service_name: packageJson.name,
        version: packageJson.version,
        message: 'Health check OK',
        hostname: hostname,
      });
    });
  });
});
