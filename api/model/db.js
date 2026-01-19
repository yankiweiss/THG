import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';

const dataBasePool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false,
    }
});



export default dataBasePool;