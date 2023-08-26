import express from 'express';
import mongoose from 'mongoose';

import authMiddleware from './middlewares/auth.middleware';

require('dotenv').config();

const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const debtRouter = require('./routes/debt.route');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Connected to server!");
  console.log(req.ip)
});

app.use('/auth', authRouter);
app.use(authMiddleware);
app.use('/user', userRouter);
app.use('/debt', debtRouter);



mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });

module.exports = app;