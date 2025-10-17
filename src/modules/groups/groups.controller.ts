import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { AddGroupMembersDto } from './dto/add-group-members.dto';
import { CreateGroupExpenseDto } from './dto/create-group-expense.dto';
import {
  GroupResponseDto,
  GroupExpenseResponseDto,
  GroupMemberResponseDto,
} from './dto/group-response.dto';

@ApiTags('groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 409, description: 'Group with this name already exists' })
  async createGroup(
    @Request() req,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<GroupResponseDto> {
    const group = await this.groupsService.createGroup(req.user.userId, createGroupDto);
    return this.mapToGroupResponse(group);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups owned by current user' })
  @ApiResponse({
    status: 200,
    description: 'List of groups',
    type: [GroupResponseDto],
  })
  async findAllGroups(@Request() req): Promise<GroupResponseDto[]> {
    const groups = await this.groupsService.findAllByOwner(req.user.userId);
    return groups.map((group) => this.mapToGroupResponse(group));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group details by ID' })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Group details',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the group owner' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findGroupById(@Request() req, @Param('id') id: string): Promise<GroupResponseDto> {
    const group = await this.groupsService.findById(id, req.user.userId);
    return this.mapToGroupResponse(group);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add members to a group' })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Members added successfully',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the group owner' })
  @ApiResponse({ status: 404, description: 'Group or user not found' })
  async addMembers(
    @Request() req,
    @Param('id') id: string,
    @Body() addGroupMembersDto: AddGroupMembersDto,
  ): Promise<GroupResponseDto> {
    const group = await this.groupsService.addMembers(id, req.user.userId, addGroupMembersDto);
    return this.mapToGroupResponse(group);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a member from a group' })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiParam({ name: 'memberId', description: 'Member user ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Member removed successfully',
    type: GroupResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the group owner' })
  @ApiResponse({ status: 404, description: 'Group or member not found' })
  async removeMember(
    @Request() req,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ): Promise<GroupResponseDto> {
    const group = await this.groupsService.removeMember(id, memberId, req.user.userId);
    return this.mapToGroupResponse(group);
  }

  @Post(':id/expense')
  @ApiOperation({
    summary: 'Add an expense to a group and split equally among members',
    description:
      'Creates individual loan records for each group member with equal shares. The owner is the lender, and each member becomes a borrower.',
  })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiResponse({
    status: 201,
    description: 'Expense split and loans created successfully',
    type: GroupExpenseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - no members in group or validation error',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - not the group owner' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({ status: 500, description: 'Internal server error - transaction failed' })
  async createGroupExpense(
    @Request() req,
    @Param('id') id: string,
    @Body() createGroupExpenseDto: CreateGroupExpenseDto,
  ): Promise<GroupExpenseResponseDto> {
    const result = await this.groupsService.createGroupExpense(
      id,
      req.user.userId,
      createGroupExpenseDto,
    );

    return {
      groupExpenseId: result.groupExpenseId,
      loanIds: result.loanIds,
      totalAmount: result.totalAmount,
      participantsCount: result.participantsCount,
      message: `Expense of ${result.totalAmount} split among ${result.participantsCount} participants. ${result.loanIds.length} loans created.`,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a group' })
  @ApiParam({ name: 'id', description: 'Group ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'Group deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the group owner' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async deleteGroup(@Request() req, @Param('id') id: string): Promise<void> {
    await this.groupsService.deleteGroup(id, req.user.userId);
  }

  // Helper method to map entity to response DTO
  private mapToGroupResponse(group: any): GroupResponseDto {
    return {
      id: group.id,
      name: group.name,
      description: group.description,
      ownerId: group.ownerId,
      members: group.members
        ? group.members.map((gm) => ({
            id: gm.id,
            memberId: gm.memberId,
            memberName: gm.member?.name || '',
            memberUsername: gm.member?.username || '',
            createdAt: gm.createdAt,
          }))
        : [],
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }
}
