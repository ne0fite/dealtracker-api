import { Test } from '@nestjs/testing';

import { DatabaseModule } from '../database/database.module';
import Deal from '../models/deal';

import { dealProviders } from './deal.providers';
import { DealService } from './deal.service';

describe('DealService', () => {
  let dealService: DealService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [DealService, ...dealProviders],
    }).compile();
    dealService = moduleRef.get<DealService>(DealService);
  });

  it('should calculate deal - % fee', () => {
    const deal = new Deal({
      units: 100,
      openPrice: 5,
      takeProfit: 20,
      stopLoss: 2,
      feeOpen: 0.25,
      feeClose: 0.35,
      feeType: 'percent',
      closePrice: 6.1,
    });

    dealService.calculate(deal);

    expect(deal.invest).toBe(500);

    expect(deal.takeProfitAmount).toBe(100);
    expect(deal.stopLossAmount).toBe(10);

    expect(deal.openFeeAmount).toBe(1.25);

    expect(deal.takeProfitFeeAmount).toBeCloseTo(2.112);
    expect(deal.takeProfitCostBasis).toBeCloseTo(503.362);
    expect(deal.takeProfitGross).toBeCloseTo(603.362);
    expect(deal.takeProfitPrice).toBeCloseTo(6.034);

    expect(deal.stopLossFeeAmount).toBeCloseTo(1.719);
    expect(deal.stopLossCostBasis).toBeCloseTo(502.969);
    expect(deal.stopLossGross).toBeCloseTo(492.975);
    expect(deal.stopLossPrice).toBeCloseTo(4.93);

    expect(deal.closeGross).toBe(610);
    expect(deal.closeFeeAmount).toBeCloseTo(2.135);
    expect(deal.closeCostBasis).toBeCloseTo(503.385);

    expect(deal.profitLoss).toBeCloseTo(106.615);
  });

  it('should calculate deal - flat fee', () => {
    const deal = new Deal({
      units: 100,
      openPrice: 5,
      takeProfit: 20,
      stopLoss: 2,
      feeOpen: 0.25,
      feeClose: 0.35,
      feeType: 'flat',
      closePrice: 6.1,
    });

    dealService.calculate(deal);

    expect(deal.invest).toBe(500);

    expect(deal.takeProfitAmount).toBe(100);
    expect(deal.stopLossAmount).toBe(10);

    expect(deal.openFeeAmount).toBe(0.25);

    expect(deal.takeProfitFeeAmount).toBeCloseTo(0.35);
    expect(deal.takeProfitCostBasis).toBeCloseTo(500.6);
    expect(deal.takeProfitGross).toBeCloseTo(600.6);
    expect(deal.takeProfitPrice).toBeCloseTo(6.006);

    expect(deal.stopLossFeeAmount).toBeCloseTo(0.35);
    expect(deal.stopLossCostBasis).toBeCloseTo(500.6);
    expect(deal.stopLossGross).toBeCloseTo(490.6);
    expect(deal.stopLossPrice).toBeCloseTo(4.906);

    expect(deal.closeGross).toBe(610);
    expect(deal.closeFeeAmount).toBeCloseTo(0.35);
    expect(deal.closeCostBasis).toBeCloseTo(500.6);

    expect(deal.profitLoss).toBeCloseTo(109.4);
  });
});
