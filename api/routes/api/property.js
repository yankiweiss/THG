import express from 'express';
import { postAProperty } from '../../controllers/propertyController';
const router = express.Router();


router.route('/').post(postAProperty)


export default router;