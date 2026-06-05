import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
dotenv.config({ path: path.join(import.meta.dirname, '.env') }); // Load variables specifically from this folder

import connection from './db/conn.js';
import productRoutes from "./routes/ProductRoute.js";
import userRoutes from "./routes/UserRoute.js";
import cookieParser from 'cookie-parser';
import OrderRouter from './routes/OrderRouter.js';

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({ origin: true, credentials: true }));
app.use(express.json()); // ضروري جداً لكي يفهم السيرفر بيانات بوست مان
app.use(cookieParser()); // ضروري جداً لكي يقرأ السيرفر الكوكيز من المتصفح
app.use("/api/v1", productRoutes); // سيصبح الرابط: http://localhost:8000/api/v1/product/new
app.use("/api/v1", userRoutes); // سيصبح الرابط: http://localhost:8000/api/v1/register
app.use("/api/v1", OrderRouter); // سيصبح الرابط: http://localhost:8000/api/v1/order/new
// Connect to DB
connection();

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;