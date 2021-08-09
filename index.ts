// importing all the dependencies
import express, { Application, Request, Response } from 'express';
export const app: Application = express();
import { config } from 'dotenv';
config({ path: './src/config/.env' });
import { connect } from 'mongoose';
import passport from 'passport';
//Initialization of port number
const port = process.env.PORT || 8000;
// importing all the routes
import { router as authRouter } from './src/api/auth';
import { router as appointmentRouter } from './src/api/appointment';

// Initialization of Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
// DB connection
(async () => {
	try {
		const connection = await connect(String(process.env.mongoDbUrl), {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		if (connection?.connection?.readyState !== 1)
			console.log('connection to db is failed');
		console.log(
			`Connected to ${connection?.connection?.name} by ${connection?.connection?.user}`,
		);
	} catch (error) {
		console.log('An unexpected error come while connecting to DB', error);
	}
})();
// All Routes
app.use('/api/auth', authRouter);
app.use('/api/appointment', appointmentRouter);

//  importing passport strategies
import { jwtStrategy as adminJwtStrategy } from './src/strategies/jwtStrategies/admin';
adminJwtStrategy(passport);
import { jwtStrategy as customerJwtStrategy } from './src/strategies/jwtStrategies/customer';
customerJwtStrategy(passport);

//for testing
app.get('/', (req: Request, res: Response) => {
	console.log(req.ip);
	res.status(200).json('Server is running');
});
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
