import express from 'express';
import { postAProperty } from './controllers/propertyController.js';
const app = express();
import cors from 'cors'

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());


app.use('/properties', postAProperty)

app.listen(PORT, ()=> {
    console.log(`APP ruining on ${PORT}`)
})


