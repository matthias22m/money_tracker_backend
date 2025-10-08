import { IsEnum } from 'class-validator';
import { SettlementStatus } from '../../../common/enums/settlement-status.enum';

export class UpdateSettlementDto {
  @IsEnum(SettlementStatus)
  status: SettlementStatus.CONFIRMED | SettlementStatus.REJECTED;
}
