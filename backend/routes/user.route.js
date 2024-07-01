import express from 'express';
import { test, updateUser, deleteUser, getUser, getUsername, followUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUSer.js';

const router=express.Router();

router.get('/search',getUsername);
router.post('/update/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/:id',verifyToken,getUser);
router.post('/follow/:id',verifyToken,followUser);

export default router;