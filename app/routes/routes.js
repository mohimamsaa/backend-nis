//app/routes/route.js

import express from 'express';

import { createAll, updateAll, deleteAll, getFeatures } from '../controllers/controllers';

const router = express.Router();

// buses Routes

router.post('/create', createAll);
router.post('/update', updateAll);
router.post('/delete', deleteAll);
router.get('/get-features', getFeatures);

export default router;