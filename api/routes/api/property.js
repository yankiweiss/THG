import express from 'express';
import { getAllProperties, postAProperty } from '../../controllers/propertyController.js';
const router = express.Router();


router.route('/addDeal').post(postAProperty).get('/', getAllProperties)


export default router;