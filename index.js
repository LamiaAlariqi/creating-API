import express from 'express';
import dotenv from 'dotenv';
import connection from './db/conn.js';
import productRoutes from "./routes/ProductRoute.js";

dotenv.config();
connection()
const app = express();
const PORT = process.env.PORT

app.use(express.json()); // ضروري جداً لكي يفهم السيرفر بيانات بوست مان
app.use("/api/v1", productRoutes); // سيصبح الرابط: http://localhost:8000/api/v1/product/new
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});