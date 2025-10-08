import { IsEnum } from 'class-validator';
import { ComplaintStatus } from '../../../common/enums/complaint-status.enum';

export class UpdateComplaintDto {
  @IsEnum(ComplaintStatus)
  status: ComplaintStatus.RESOLVED | ComplaintStatus.REJECTED;
}
