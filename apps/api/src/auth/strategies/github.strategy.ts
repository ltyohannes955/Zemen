import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.API_URL || 'http://localhost:4000'}/api/v1/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void) {
    const { id, displayName, emails, photos } = profile;
    done(null, {
      providerId: id,
      email: emails?.[0]?.value || null,
      name: displayName,
      avatarUrl: photos?.[0]?.value || null,
    });
  }
}
