import express from 'express';
import { ItemControllers } from '../controllers/itemController'; 

const router = express.Router();

// ItemControllers (plural) ব্যবহার করো
router.post('/create-item', ItemControllers.createItem);
router.get('/', ItemControllers.getAllItems);

export const ItemRoutes = router;