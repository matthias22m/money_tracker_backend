import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BudgetRepository } from '../repositories/budget.repository';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { Budget } from '../entities/budget.entity';

@Injectable()
export class BudgetService {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string): Promise<Budget> {
    return this.budgetRepository.create({ ...createBudgetDto, userId });
  }

  async findAll(userId: string): Promise<Budget[]> {
    return this.budgetRepository.findAllByUserId(userId);
  }

  async findOne(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findById(id);
    if (!budget) {
      throw new NotFoundException(`Budget with ID "${id}" not found`);
    }
    if (budget.userId !== userId) {
      throw new UnauthorizedException();
    }
    return budget;
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, userId: string): Promise<Budget> {
    await this.findOne(id, userId);
    return this.budgetRepository.update(id, updateBudgetDto);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId);
    const result = await this.budgetRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`Budget with ID "${id}" not found`);
    }
  }
}
