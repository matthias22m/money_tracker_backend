import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('summary')
  getSummary(
    @Query('userId') userId: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.analyticsService.getSummary(userId, from, to);
  }

  @Get('category-breakdown')
  getCategoryBreakdown(
    @Query('userId') userId: string,
    @Query('month') month: string,
  ) {
    return this.analyticsService.getCategoryBreakdown(userId, month);
  }

  @Get('expenses/trend')
  getExpenseTrend(
    @Query('userId') userId: string,
    @Query('months') months: number,
  ) {
    return this.analyticsService.getExpenseTrend(userId, months);
  }

  @Get('loans/summary')
  getLoanSummary(@Query('userId') userId: string) {
    return this.analyticsService.getLoanSummary(userId);
  }

  @Get('settlements/history')
  getSettlementHistory(@Query('loanId') loanId: string) {
    return this.analyticsService.getSettlementHistory(loanId);
  }
}
