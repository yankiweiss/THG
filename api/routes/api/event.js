import express from 'express';
import postAEvent from '../../controllers/eventController.js';
const eventRouter = express.Router();


router.post('/event', postAEvent)



export default eventRouter;