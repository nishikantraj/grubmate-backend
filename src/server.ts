import http from 'http';
import app from './app';
import {startDatabaseAndInitSchema} from './config/startServerAndInitiateServer';

// Database connection
startDatabaseAndInitSchema();

// server listening 
const router = http.createServer(app);

const PORT = 5002;
router.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))