import { Socket } from 'net';
import { LoggerService } from '@nestjs/common';

import { Deal as DealType } from '../../common/types/deal.type';
import { sleep } from '../../utils/sleep';
import { calculateDeal } from '../../common/calculator';
import { DealService } from '../deal.service';
import { WsException } from '@nestjs/websockets';

export class DealMonitor {
  static MONITOR_INTERVAL = 5000;
  private lastUpdateDate = new Date();
  private running = true;

  constructor(
    private dealId: string,
    private dealService: DealService,
    private client: Socket,
    private logger: LoggerService,
  ) {}

  async start() {
    const deal = await this.dealService.getById(this.dealId);
    if (!deal) {
      throw new WsException('Deal Not Found');
    }

    while (this.running) {
      this.logger.debug(`Checking Deal [id=${deal.id}]`);
      await deal.reload();

      if (this.lastUpdateDate && deal.updatedAt > this.lastUpdateDate) {
        this.logger.log(`Sending Deal Update [id=${deal.id}]`);

        const dealData = {
          ...deal.dataValues,
        } as DealType;

        calculateDeal(dealData);

        this.client.emit('dealupdate', { deal: dealData });

        this.lastUpdateDate = deal.updatedAt;
      }

      await sleep(DealMonitor.MONITOR_INTERVAL);
    }
  }

  stop() {
    this.running = false;
  }
}
