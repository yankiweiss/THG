import express from 'express';
const app = express();
import cors from 'cors'
import router from './routes/api/property.js';
import dotenv from 'dotenv';
dotenv.config()

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());


app.use('/properties', router)

app.listen(PORT, ()=> {
    console.log(`APP ruining on ${PORT}`)
})


