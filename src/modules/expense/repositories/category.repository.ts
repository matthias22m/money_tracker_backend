import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../interfaces/category.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class CategoryRepository
  extends BaseRepository<Category>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(Category)
    protected readonly repository: Repository<Category>,
  ) {
    super(repository);
  }

  async findAllByUserId(userId: string): Promise<Category[]> {
    return this.repository.find({ where: { userId } });
  }
}
