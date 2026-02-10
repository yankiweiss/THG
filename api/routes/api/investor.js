import express from 'express';
import { getInvestorByID } from '../../controllers/investorController.js';

const investorRouter = express.Router();

investorRouter.get('/:propertyId/:investorId', getInvestorByID);





export default investorRouter;