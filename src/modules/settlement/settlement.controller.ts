import { Controller, Post, Body, Patch, Param, UseGuards, Req, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SettlementService } from './settlement.service';
import { CreateSettlementDto } from '../loan/dto/create-settlement.dto';
import { SettlementStatus } from '../../common/enums/settlement-status.enum';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('settlements')
@Controller('settlements')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Post()
  createSettlement(@Body() createSettlementDto: CreateSettlementDto) {
    // Note: Loan ID should be part of the DTO or path
    // This is a placeholder until the DTO is updated
    const loanId = '...'; // Replace with actual loanId from DTO
    return this.settlementService.createSettlement(loanId, createSettlementDto);
  }

  @Patch(':id/confirm')
  confirmSettlement(@Req() req: any, @Param('id') settlementId: string) {
    return this.settlementService.confirmOrRejectSettlement(settlementId, req.user.userId, SettlementStatus.CONFIRMED);
  }

  @Patch(':id/reject')
  rejectSettlement(@Req() req: any, @Param('id') settlementId: string) {
    return this.settlementService.confirmOrRejectSettlement(settlementId, req.user.userId, SettlementStatus.REJECTED);
  }

  @Get()
  findSettlementsForLoan(@Query('loanId') loanId: string) {
    return this.settlementService.findSettlementsForLoan(loanId);
  }
}
