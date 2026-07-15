import { Module, Logger, type Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { OAuthController } from './oauth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

const hasGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const hasGithub = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

if (hasGoogle) Logger.log('Google OAuth strategy registered');
else Logger.warn('Google OAuth disabled: set GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET');

if (hasGithub) Logger.log('GitHub OAuth strategy registered');
else Logger.warn('GitHub OAuth disabled: set GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET');

const providers: Provider[] = [AuthService, JwtStrategy];

if (hasGoogle) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { GoogleStrategy } = require('./strategies/google.strategy');
  providers.push(GoogleStrategy);
}
if (hasGithub) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { GithubStrategy } = require('./strategies/github.strategy');
  providers.push(GithubStrategy);
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController, OAuthController],
  providers,
  exports: [AuthService],
})
export class AuthModule {}
