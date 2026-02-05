import express from 'express';
import { deleteProperty, getAllProperties, getPropertyById, postAInvestor, postAProperty } from '../../controllers/propertyController.js';
const router = express.Router();


router.post('/addDeal', postAProperty)
router.get('/:id', getPropertyById)
router.get('/', getAllProperties)
router.delete('/:id', deleteProperty)
router.post('/postInvestor', postAInvestor)


export default router;