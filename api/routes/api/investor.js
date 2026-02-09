import express from 'express';
import { getInvestorByID } from '../../controllers/investorController.js';

const investorRouter = express.Router();

investorRouter.get('/:id', getInvestorByID)





export default investorRouter;