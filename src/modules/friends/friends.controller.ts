import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}
  
  @Post('request/:receiverId')
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiResponse({ status: 201, description: 'Request sent' })
  @ApiResponse({ status: 404, description: 'Receiver not found' })
  @ApiResponse({ status: 409, description: 'Request already exists or already friends' })
  sendRequest(@Req() req: any, @Param('receiverId') receiverId: string) {
    const senderId = req.user.userId;
    return this.friendsService.sendRequest(senderId, receiverId);
  }

  @Post('accept/:requestId')
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiResponse({ status: 200, description: 'Request accepted' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  acceptRequest(@Req() req: any, @Param('requestId') requestId: string) {
    const userId = req.user.userId;
    return this.friendsService.acceptRequest(userId, requestId);
  }

  @Post('reject/:requestId')
  @ApiOperation({ summary: 'Reject a friend request' })
  @ApiResponse({ status: 200, description: 'Request rejected' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  rejectRequest(@Req() req: any, @Param('requestId') requestId: string) {
    const userId = req.user.userId;
    return this.friendsService.rejectRequest(userId, requestId);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List all friend requests for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of friend requests' })
  listFriendRequests(@Req() req: any, @Query('type') type: 'sent' | 'received' = 'received') {
    const userId = req.user.userId;
    return this.friendsService.listFriendRequests(userId, type);
  }

  @Get()
  @ApiOperation({ summary: 'List all friends for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of friends' })
  listFriends(@Req() req: any) {
    const userId = req.user.userId;
    return this.friendsService.listFriends(userId);
  }

  @Delete(':friendId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a friend' })
  @ApiResponse({ status: 204, description: 'Friend removed' })
  @ApiResponse({ status: 404, description: 'Friendship not found' })
  removeFriend(@Req() req: any, @Param('friendId') friendId: string) {
    const userId = req.user.userId;
    return this.friendsService.removeFriend(userId, friendId);
  }
}
