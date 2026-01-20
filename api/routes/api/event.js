import express from 'express';
import postAEvent from '../../controllers/eventController.js';
const router = express.Router();


router.post('/event', postAEvent)



export default eventRouter;