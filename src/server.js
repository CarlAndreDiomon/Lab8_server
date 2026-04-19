import express from 'express';
import connectDB from './config/db.js';
import { PORT } from './config/config.js';
import userRoute from './routes/userRoutes.js';
import productRoute from './routes/productRoutes.js';
import cartRoute from './routes/cartRoutes.js';
import orderRoute from './routes/orderRoutes.js';
import protect from './middleware/authMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

const app = express();

const __dirname = path.resolve(); 

app.use(cors({
  
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', protect, (req, res) => {
  res.send("Hello LORD");
})

app.use('/api/auth', userRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/order', orderRoute);

connectDB().then(() => app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
}))


