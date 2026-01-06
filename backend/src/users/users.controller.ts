import { Controller, Get, UseGuards, Request, Param, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	/**
	 * GET /users/me (protegido)
	 * Retorna dados do gestor logado (sem password)
	 */
	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	async me(@Request() req) {
		const profile = await this.usersService.getProfileById(req.user.userId);
		if (!profile) throw new NotFoundException('Usuário não encontrado');
		return profile;
	}

	/**
	 * GET /users/public/:slug (público)
	 * Retorna informações públicas para exibir no formulário de avaliação
	 */
	@Get('public/:slug')
	async publicBySlug(@Param('slug') slug: string) {
		const tenant = await this.usersService.getPublicBySlug(slug);
		if (!tenant) throw new NotFoundException('Empresa não encontrada');
		return tenant;
	}
}
