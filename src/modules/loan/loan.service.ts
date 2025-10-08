import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LoanRepository } from './repositories/loan.repository';
import { FriendsRepository } from '../friends/repositories/friends.repository';
import { NotificationService } from '../notification/notification.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { LoanStatus } from '../../common/enums/loan-status.enum';

@Injectable()
export class LoanService {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly friendsRepository: FriendsRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async createLoan(lenderId: string, createLoanDto: CreateLoanDto) {
    const { borrowerId, amount, description } = createLoanDto;

    if (lenderId === borrowerId) {
      throw new BadRequestException('Lender and borrower cannot be the same person.');
    }

    const areFriends = await this.friendsRepository.findFriendship(lenderId, borrowerId);
    if (!areFriends) {
      throw new BadRequestException('You can only create loans with your friends.');
    }

    const loan = await this.loanRepository.create({
      lenderId,
      borrowerId,
      amount,
      description,
      status: LoanStatus.ACTIVE,
    });

    this.notificationService.notifyLoanCreated(loan);

    return loan;
  }

  async findLoans(userId: string, filters?: any) {
    return this.loanRepository.findAllByUserId(userId, filters);
  }

}
