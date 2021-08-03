const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const keys = require('dotenv').config({ path: './src/config/.env' });
const mongoose = require('mongoose');
const auth = require('./src/api/auth');

//Check if keys are loaded from .env file
if (keys.error) {
	console.log('There is an error in loading the keys from .env file');
	throw keys.error;
}

// Initialization of Middleware for getting data from client
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route for testing the application
app.get('/', (req, res) => {
	res.status(200).json({
		isSuccess: true,
		successMessage: `Application is running on port ${port}`,
	});
});

// DB connection
mongoose
	.connect(process.env.mongoDbUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then((user) => console.log('Connected'))
	.catch((err) => console.log('Error ', err));

// Routes
app.use('/api/auth', auth);

app.listen(port, (err) => {
	if (err) {
		console.log('There is a problem in app.listen function in index.js file');
	} else {
		console.log(`Server is running on port ${port}`);
	}
});
