import { Test, TestingModule } from '@nestjs/testing';
import { AlphavantageController } from './alphavantage.controller';
import { ApiService } from './api.service';
import { HttpModule } from '@nestjs/axios';

describe('AlphavantageController', () => {
  let controller: AlphavantageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlphavantageController],
      imports: [HttpModule],
      providers: [ApiService],
    }).compile();

    controller = module.get<AlphavantageController>(AlphavantageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
