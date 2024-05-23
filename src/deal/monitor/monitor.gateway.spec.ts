import { Test, TestingModule } from '@nestjs/testing';
import { MonitorGateway } from './monitor.gateway';
import { DealModule } from '../deal.module';

describe('MonitorGateway', () => {
  let gateway: MonitorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitorGateway],
      imports: [DealModule],
    }).compile();

    gateway = module.get<MonitorGateway>(MonitorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
