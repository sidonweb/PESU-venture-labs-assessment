import express from 'express';
import { createUser, deleteUser, getUser, readUser, updateUser } from '../controllers/userController.js';
const router = express.Router();
import { verifyToken } from '../utils/auth.js';


router.post('/register',createUser);
router.put('/update', verifyToken, updateUser);
router.get('/user', verifyToken, getUser);
router.get('/profile', verifyToken, readUser);
router.delete('/delete', verifyToken, deleteUser);

export default router