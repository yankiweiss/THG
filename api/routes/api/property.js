import express from 'express';
import { deleteProperty, getAllProperties, getPropertyById, postAProperty, updatePropertyField, getAllProperties2 } from '../../controllers/propertyController.js';
const router = express.Router();


router.post('/addDeal', postAProperty)
router.get('/:id', getPropertyById)
router.get('/', getAllProperties2)
router.delete('/:id', deleteProperty)
router.put('/:id', updatePropertyField)



export default router;