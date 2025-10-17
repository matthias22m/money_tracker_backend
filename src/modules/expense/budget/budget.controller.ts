import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { AuthGuard } from '@nestjs/passport';
import { BudgetService } from './budget.service';

@UseGuards(AuthGuard('jwt'))
@Controller('expense/budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Req() req) {
    return this.budgetService.create(createBudgetDto, req.user.userId);
  }

  @Get()
  findAll(@Req() req) {
    return this.budgetService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.budgetService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto, @Req() req) {
    return this.budgetService.update(id, updateBudgetDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.budgetService.remove(id, req.user.userId);
  }
}
