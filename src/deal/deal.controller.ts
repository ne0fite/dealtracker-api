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
} from '@nestjs/common';

import Deal from '../models/deal';
import { DealService } from './deal.service';
import { DealDto } from '../common/types/deal.dto';
import { FindDealResponse } from '../common/types';
import { DealStats } from 'src/common/types/deal-stats';
import { AuthGuard } from 'src/auth/auth.guard';
import { QueryInterface } from 'src/sequelize-options-builder';

@Controller('/api/v1/deal')
@UseGuards(AuthGuard)
export class DealController {
  constructor(private dealService: DealService) {}

  @Get('')
  async find(@Query() query: QueryInterface): Promise<FindDealResponse> {
    const results = await this.dealService.findAll(query);

    return {
      totalRows: results.length,
      results,
    };
  }

  @Get('stats')
  async getStats(@Query() query: QueryInterface): Promise<DealStats> {
    return this.dealService.getStats(query);
  }

  @Get(':id')
  async get(@Param() params: any): Promise<Deal> {
    const deal = await this.dealService.getById(params.id);
    if (!deal) {
      throw new NotFoundException('Deal Not Found');
    }
    return deal;
  }

  @Post('')
  async create(@Body() createDealDto: DealDto): Promise<Deal> {
    return this.dealService.create(createDealDto);
  }

  @Post(':id')
  async update(
    @Param() params: any,
    @Body() updateDealDto: DealDto,
  ): Promise<Deal> {
    const deal = await this.dealService.getById(params.id);
    if (!deal) {
      throw new NotFoundException('Deal Not Found');
    }
    return this.dealService.update(deal, updateDealDto);
  }

  @Delete(':id')
  async delete(@Param() params: any): Promise<Deal> {
    const deal = await this.dealService.getById(params.id);
    if (!deal) {
      throw new NotFoundException('Deal Not Found');
    }
    await deal.destroy();
    return deal;
  }
}
