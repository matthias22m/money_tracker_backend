import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from './repositories/category.repository';
import { ExpenseRepository } from './repositories/expense.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly expenseRepository: ExpenseRepository,
  ) {}

  // Category methods
  async createCategory(userId: string, createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.create({ ...createCategoryDto, userId });
  }

  async findAllCategories(userId: string) {
    return this.categoryRepository.findAllByUserId(userId);
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.update(id, updateCategoryDto);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async removeCategory(id: string) {
    const deleted = await this.categoryRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  // Expense methods
  async createExpense(userId: string, createExpenseDto: CreateExpenseDto) {
    return this.expenseRepository.create({ ...createExpenseDto, userId });
  }

  async findAllExpenses(userId: string, filters?: any) {
    return this.expenseRepository.findAllByUserId(userId, filters);
  }

  async getExpenseSummary(userId: string, filters?: any) {
    return this.expenseRepository.getSummary(userId, filters);
  }

  async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseRepository.update(id, updateExpenseDto);
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async removeExpense(id: string) {
    const deleted = await this.expenseRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
}
