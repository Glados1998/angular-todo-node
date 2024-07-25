/**
 * This script sets up and starts the Express server for a simple todo application.
 * It connects to a MongoDB database, configures middleware, and registers routes.
 */

require('dotenv').config();
import express, {Application} from 'express';
import mongoose from 'mongoose';
import todoRoute from "./routes/todo.route";
import userRoute from "./routes/user.route";

import cors from 'cors';
const app: Application = express();
const port = process.env.PORT || 3000;

/**
 * Connects to the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is successful or rejects with an error.
 */
mongoose.connect("mongodb://localhost:27017/todos",).then(r => {
    console.log('Connected to MongoDB');
}).catch(e => {
    console.log('Error connecting to MongoDB');
    console.log(e);
})

/**
 * Configures the Express application to use JSON and URL-encoded request bodies.
 */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/**
 * Configures the Express application to use CORS.
 */
app.use(cors());

/**
 * Registers the todo, and the user route with the Express application.
 */
app.use('/todos', todoRoute);
app.use('/user', userRoute);

/**
 * Starts the Express server and logs a message when it's running.
 * @param {number} port - The port number on which the server will listen.
 */
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
