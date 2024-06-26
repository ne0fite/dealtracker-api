import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Injectable, Logger, Request } from '@nestjs/common';
import { Socket } from 'net';

import { DealService } from '../deal.service';
import { DealMonitor } from './monitor';
import User from 'src/models/user';

@Injectable()
@WebSocketGateway({
  cors: true,
})
export class MonitorGateway {
  private readonly logger = new Logger(MonitorGateway.name);

  private monitors: Map<string, DealMonitor> = new Map();

  constructor(private dealService: DealService) {}

  @SubscribeMessage('monitordeal')
  subscribeMonitorDeal(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: Socket,
    @Request() request,
  ) {
    const user: User = request['user'];

    this.logger.debug(`Start monitoring deal ${id}`);

    this.monitorDeal(id, user.accountId, client);

    return { status: 'OK' };
  }

  @SubscribeMessage('unmonitordeal')
  unsubscribeMonitorDeal(@MessageBody('id') id: string) {
    this.logger.debug(`Stop monitoring deal ${id}`);

    this.unmonitordeal(id);

    return { status: 'OK' };
  }

  monitorDeal(id, accountId, client): void {
    if (this.monitors.has(id)) {
      this.logger.debug(`Monitor already started for deal ${id}`);
    }

    const monitor = new DealMonitor(
      id,
      accountId,
      this.dealService,
      client,
      this.logger,
    );

    monitor.start().catch((error) => {
      this.logger.error(
        `Failed to start monitor for deal ID ${id}: ${error.message}`,
      );
    });

    this.monitors.set(id, monitor);
  }

  unmonitordeal(id): void {
    const monitor = this.monitors.get(id);

    if (monitor) {
      monitor.stop();
    } else {
      this.logger.debug(`Deal not currently being monitored ${id}`);
    }

    this.monitors.delete(id);
  }
}
