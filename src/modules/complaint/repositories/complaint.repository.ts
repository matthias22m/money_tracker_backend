import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from '../entities/complaint.entity';
import { IComplaintRepository } from '../interfaces/complaint.interface';
import { BaseRepository } from '../../../common/base/base.repository';

@Injectable()
export class ComplaintRepository
  extends BaseRepository<Complaint>
  implements IComplaintRepository
{
  constructor(
    @InjectRepository(Complaint)
    protected readonly repository: Repository<Complaint>,
  ) {
    super(repository);
  }

  async findAll(filters?: any): Promise<Complaint[]> {
    const query = this.repository.createQueryBuilder('complaint');

    if (filters) {
      if (filters.userId) {
        query.andWhere('complaint.userId = :userId', { userId: filters.userId });
      }
      if (filters.status) {
        query.andWhere('complaint.status = :status', { status: filters.status });
      }
    }

    return query.getMany();
  }
}
