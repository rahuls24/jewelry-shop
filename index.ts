// importing all the dependencies
import express, { Application, Request, Response } from 'express';
const app: Application = express();
import { config } from 'dotenv';
config({ path: './src/config/.env' });
import { connect, Mongoose } from 'mongoose';
//Initialization of port number
const port = process.env.PORT || 8000;

// importing all the routes
import { authRouter } from './src/api/auth';
// Initialization of Middleware for getting data from client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connection
(async () => {
	const connection = await connect(String(process.env.mongoDbUrl), {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	if (connection?.connection?.readyState !== 1)
		console.log('connection to db is failed');
	console.log(
		`Connected to ${connection.connection.name} by ${connection.connection.user}`,
	);
})();
// All Routes
app.use('/api/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
	res.send('HomePage');
});
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
