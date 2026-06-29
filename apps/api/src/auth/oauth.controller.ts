import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class OAuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: any) {
    const result = await this.authService.findOrCreateOAuthUser(
      'google',
      req.user.providerId,
      req.user.email,
      req.user.name,
      req.user.avatarUrl,
    );
    const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');
    redirectUrl.searchParams.set('token', result.accessToken);
    redirectUrl.searchParams.set('refreshToken', result.refreshToken);
    res.redirect(redirectUrl.toString());
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: any, @Res() res: any) {
    const result = await this.authService.findOrCreateOAuthUser(
      'github',
      req.user.providerId,
      req.user.email,
      req.user.name,
      req.user.avatarUrl,
    );
    const redirectUrl = new URL(process.env.FRONTEND_URL || 'http://localhost:3000');
    redirectUrl.searchParams.set('token', result.accessToken);
    redirectUrl.searchParams.set('refreshToken', result.refreshToken);
    res.redirect(redirectUrl.toString());
  }
}
