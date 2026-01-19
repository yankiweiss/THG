import express from 'express';
import { postAProperty } from '../../controllers/propertyController.js';
const router = express.Router();


router.route('/addDeal').post(postAProperty)


export default router;