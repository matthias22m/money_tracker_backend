import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assuming admin role guard will be added later
import { AnalyticsService } from './analytics.service';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard) // Placeholder, should be replaced with an AdminGuard
@ApiTags('analytics (admin)')
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue')
  getSystemRevenue(
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.analyticsService.getSystemRevenue(from, to);
  }

  @Get('top-debtors')
  getTopDebtors(@Query('limit') limit = 20) {
    return this.analyticsService.getTopDebtors(limit);
  }
}
