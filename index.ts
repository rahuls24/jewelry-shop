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
import { authRouter } from './src/api/auth';

// Initialization of Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// DB connection
(async () => {
	const connection = await connect(String(process.env.mongoDbUrl), {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	if (connection?.connection?.readyState !== 1)
		console.log('connection to db is failed');
	console.log(
		`Connected to ${connection?.connection?.name} by ${connection?.connection?.user}`,
	);
})();
// All Routes
app.use('/api/auth', authRouter);

//  importing passport strategies
import { jwtStrategy } from './src/strategies/jwtStrategies';
jwtStrategy(passport);

//for testing
app.get('/', (req: Request, res: Response) => {
	res.status(200).json('Server is running');
});
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
