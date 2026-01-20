import express from 'express';
import { getAllProperties, getPropertyById, postAProperty } from '../../controllers/propertyController.js';
const router = express.Router();


router.post('/addDeal', postAProperty)
router.get('/:id', getPropertyById)
router.get('/', getAllProperties)


export default router;