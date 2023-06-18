import express from 'express';
import mongoose from 'mongoose';

import authMiddleware from './middlewares/auth.middleware';

require('dotenv').config();

const authRouter = require('./routes/auth.route');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRouter);

app.use(authMiddleware);

app.get('/', (req, res) => {
  res.send(req.body.user);
});

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });


