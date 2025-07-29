import express from 'express';
import userRoutes from './routes/users.routes'
import cookieParser from 'cookie-parser';


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);


export default app;