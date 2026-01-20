import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors'
import router from './routes/api/property.js';
import eventRouter from './routes/api/event.js';

dotenv.config()
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());


app.use('/api/properties', router)
app.use('/api/event', eventRouter)

app.listen(PORT, ()=> {
    console.log(`APP ruining on ${PORT}`)
})


