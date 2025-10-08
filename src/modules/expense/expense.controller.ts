import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExpenseService } from './expense.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}
  
  // Categories
  @ApiTags('categories')
  @Post('categories')
  createCategory(@Req() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    return this.expenseService.createCategory(req.user.userId, createCategoryDto);
  }
  
  @ApiTags('categories')
  @Get('categories')
  findAllCategories(@Req() req: any) {
    return this.expenseService.findAllCategories(req.user.userId);
  }

  @ApiTags('categories')
  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.expenseService.updateCategory(id, updateCategoryDto);
  }

  @ApiTags('categories')
  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.expenseService.removeCategory(id);
  }
  
  // Expenses
  @ApiTags('expense')
  @Post()
  createExpense(@Req() req: any, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.createExpense(req.user.userId, createExpenseDto);
  }

  @ApiTags('expense')
  @Get()
  findAllExpenses(@Req() req: any, @Query() filters: any) {
    return this.expenseService.findAllExpenses(req.user.userId, filters);
  }
  
  @ApiTags('expense')
  @Get('summary')
  getExpenseSummary(@Req() req: any, @Query() filters: any) {
    return this.expenseService.getExpenseSummary(req.user.userId, filters);
  }
  
  @ApiTags('expense')
  @Patch(':id')
  updateExpense(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.updateExpense(id, updateExpenseDto);
  }
  
  @ApiTags('expense')
  @Delete(':id')
  removeExpense(@Param('id') id: string) {
    return this.expenseService.removeExpense(id);
  }
}
