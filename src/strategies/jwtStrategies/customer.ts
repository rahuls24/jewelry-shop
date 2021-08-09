import {
	Strategy as JwtStrategy,
	ExtractJwt as ExtractJwt,
} from 'passport-jwt';
import { User } from '../../models/user';

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.passportJwtKey,
};
export const jwtStrategy = (passport: any) => {
	passport.use(
		'customer',
		new JwtStrategy(opts, async (jwt_payload, done) => {
			const user = await User.findById(jwt_payload.data.id);
			if (user?.role === 'customer') return done(null, user);
			return done(null, false, { message: '' });
		}),
	);
};
