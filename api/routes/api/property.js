import express from 'express';
import { getAllProperties, postAProperty } from '../../controllers/propertyController.js';
const router = express.Router();


router.post('/addDeal', postAProperty)
router.get('/', getAllProperties)


export default router;