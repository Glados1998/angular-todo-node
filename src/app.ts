require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import todoRoute from "./routes/todo.route";

const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/todos",).then(r => {
    console.log('Connected to MongoDB');
}).catch(e => {
    console.log('Error connecting to MongoDB');
    console.log(e);
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/todos', todoRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
