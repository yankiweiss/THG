import express from 'express';
import { getInvestorByID } from '../../controllers/investorController';

const investorRouter = express.Router();

investorRouter.get('/:investorId', getInvestorByID)





export default investorRouter;