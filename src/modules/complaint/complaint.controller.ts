import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ComplaintService } from './complaint.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('complaints')
@Controller('complaints')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @Post()
  createComplaint(@Req() req: any, @Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintService.createComplaint(req.user.userId, createComplaintDto);
  }

  @Get()
  findComplaints(@Query() filters: any) {
    return this.complaintService.findComplaints(filters);
  }

  @Patch(':id')
  updateComplaint(
    @Param('id') id: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    // TODO: Add admin guard
    return this.complaintService.updateComplaint(id, updateComplaintDto);
  }
}
