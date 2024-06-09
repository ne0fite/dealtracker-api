import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Body,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';

import Deal from '../models/deal';
import { DealService } from './deal.service';
import { DealDto } from '../common/types/deal.dto';
import { FindDealResponse } from '../common/types';
import { DealStats } from 'src/common/types/deal-stats';
import { AuthGuard } from 'src/auth/auth.guard';
import { QueryInterface } from 'src/sequelize-options-builder';
import User from 'src/models/user';

@Controller('/api/v1/deal')
@UseGuards(AuthGuard)
export class DealController {
  constructor(private dealService: DealService) {}

  @Get('')
  async find(
    @Query() query: QueryInterface,
    @Request() request,
  ): Promise<FindDealResponse> {
    const user: User = request['user'];
    const results = await this.dealService.findAll(query, user.accountId);

    return {
      totalRows: results.length,
      results,
    };
  }

  @Get('stats')
  async getStats(
    @Query() query: QueryInterface,
    @Request() request,
  ): Promise<DealStats> {
    const user: User = request['user'];
    return this.dealService.getStats(query, user.accountId);
  }

  @Get(':id')
  async get(@Param() params: any, @Request() request): Promise<Deal> {
    const user: User = request['user'];
    const deal = await this.dealService.getById(params.id, user.accountId);
    if (!deal) {
      throw new NotFoundException('Deal Not Found');
    }
    return deal;
  }

  @Post('')
  async create(
    @Body() createDealDto: DealDto,
    @Request() request,
  ): Promise<Deal> {
    const user: User = request['user'];
    return this.dealService.create(createDealDto, user.accountId);
  }

  @Post(':id')
  async update(
    @Param() params: any,
    @Body() updateDealDto: DealDto,
    @Request() request,
  ): Promise<Deal> {
    const user: User = request['user'];
    const deal = await this.dealService.getById(params.id, user.accountId);
    if (!deal) {
      throw new NotFoundException('Deal Not Found');
    }
    return this.dealService.update(deal, updateDealDto);
  }

  @Delete(':id')
  async delete(@Param() params: any, @Request() request): Promise<Deal> {
    const user: User = request['user'];
    const deal = await this.dealService.getById(params.id, user.accountId);
    if (!deal) {
      throw new NotFoundException('Deal Not Found');
    }
    await deal.destroy();
    return deal;
  }
}
