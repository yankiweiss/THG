import express from 'express';
import { addingInvestorToProp, getInvestorByID } from '../../controllers/investorController.js';

const investorRouter = express.Router();

investorRouter.get('/:propertyId/:investorId', getInvestorByID).post('/addInvestor', addingInvestorToProp)





export default investorRouter;