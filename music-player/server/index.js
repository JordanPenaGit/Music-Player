/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
// import playlistRouter from './routes/playlistRoutes.js';

const app = express();
app.use(cors({ origin: '*' }));
const PORT = process.env.PORT || 3001;

dotenv.config();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);
// app.use('/playlists', playlistRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
