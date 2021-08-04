import express, { Application, Request, Response } from 'express';
const app: Application = express();
import { config } from 'dotenv';
const keys = config({ path: './src/config/.env' });
import { connect, Mongoose } from 'mongoose';
const port: number = Number(process.env.port) || 8000;

// importing all the routes
import { authRouter } from './src/api/auth';
import { Otp } from './src/models/otp';
console.log(new Otp({}));
//Check if keys are loaded from .env file
if (keys.error) {
	console.log('There is an error in loading the keys from .env file');
	throw keys.error;
}
// Initialization of Middleware for getting data from client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
connect(String(process.env.mongoDbUrl), {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then((user: Mongoose) => {
		console.log(
			`Connected to ${user.connections[0].name} by ${user.connections[0].user}`,
		);
		try {
			app.listen(port, () => {
				console.log(`Server is running on port ${port}`);
			});
		} catch (err) {
			console.log(
				'There is a problem in app.listen function in index.js file' + err,
			);
		}
	})
	.catch((err: Error) => console.log('Error ', err));

// All Routes
app.use('/api/auth', authRouter);
app.get('/', (req: Request, res: Response) => {
	res.send('HomePage');
});
