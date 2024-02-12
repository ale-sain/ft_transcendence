import { Controller, Get, Param, Delete, Post, Body, Patch, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './guards/roles.guards';
import {Roles} from './decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserRequest, User } from '../user/decorators/user-request.decorator';
import { ModerationService } from './moderation.service';


@UseGuards(JwtGuard, RolesGuard)
@Controller('moderation')
export class ModerationController {
	constructor(
		private readonly moderationService: ModerationService,
	) {}

	// Implement mute

	@Roles(['OWNER', 'ADMIN'])
	@Patch('ban/:name/:userId')
	banUser(@UserRequest() user: User, @Param('name') name: string, @Param('userId') userId: string) {
		if (user.id == +userId) throw new ForbiddenException('Cannot ban yourself');
		return this.moderationService.banUser(+userId, name);
	}

	@Roles(['OWNER', 'ADMIN'])
	@Patch('unban/:name/:userId')
	unbanUser(@UserRequest() user: User, @Param('name') name: string, @Param('userId') userId: string) {
		return this.moderationService.unbanUser(+userId, name);
	}

	@Roles(['OWNER', 'ADMIN'])
	@Delete('kick/:name/:userId')
	kickUser(@UserRequest() user: User, @Param('name') name: string, @Param('userId') userId: string) {
		if (user.id == +userId) throw new ForbiddenException('Cannot kick yourself');
		return this.moderationService.kickUser(+userId, name);
	}

	@Roles(['OWNER', 'ADMIN'])
	@Patch('promote/:name/:userId')
	promoteUser(@UserRequest() user: User, @Param('name') name: string, @Param('userId') userId: string) {
		return this.moderationService.promoteUser(+userId, name);
	}

	@Roles(['OWNER', 'ADMIN'])
	@Patch('demote/:name/:userId')
	demoteUser(@UserRequest() user: User, @Param('name') name: string, @Param('userId') userId: string) {
		return this.moderationService.demoteUser(+userId, name);
	}
}