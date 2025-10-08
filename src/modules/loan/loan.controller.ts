import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('loan')
@Controller('loans')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  createLoan(@Req() req: any, @Body() createLoanDto: CreateLoanDto) {
    return this.loanService.createLoan(req.user.userId, createLoanDto);
  }

  @Get()
  findLoans(@Req() req: any, @Query() filters: any) {
    return this.loanService.findLoans(req.user.userId, filters);
  }

  @Post(':id/settlements')
  addSettlement(
    @Param('id') loanId: string,
    @Body() createSettlementDto: CreateSettlementDto,
  ) {
    return this.loanService.addSettlement(loanId, createSettlementDto);
  }

  @Post('settlements/:id/confirm')
  confirmSettlement(@Req() req: any, @Param('id') settlementId: string) {
    return this.loanService.confirmSettlement(settlementId, req.user.userId);
  }
}
