import express from 'express';
import connectDB from './config/db.js';
import { PORT } from './config/config.js';
import userRoute from './routes/userRoutes.js';
import productRoute from './routes/productRoutes.js';
import protect from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
  
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', protect, (req, res) => {
  res.send("Hello LORD");
})

app.use('/api/auth', userRoute);
app.use('/api/product', productRoute);



connectDB().then(() => app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
}))


