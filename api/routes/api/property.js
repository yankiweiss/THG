import express from 'express';
import { postAProperty } from '../../controllers/propertyController';
const router = express.Router();


router.route('/').post('/addDeal' , postAProperty)


export default router;