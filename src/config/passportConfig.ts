import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

export default function(passport: passport.PassportStatic): void {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
    // The user data will be handled in the googleAuthCallback in authController
    return done(null, profile);
  }));

  passport.serializeUser((user: Express.User, done: (err: any, id?: any) => void) => {
    done(null, user);
  });

  passport.deserializeUser((obj: any, done: (err: any, user?: any) => void) => {
    done(null, obj);
  });
}