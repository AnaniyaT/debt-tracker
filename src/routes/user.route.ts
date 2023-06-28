import { Router } from "express";
import {
    getUsers,
    getUserById, 
    getUserByUsername, 
    editProfile, 
    getMe, 
    changePassword, 
    deleteUser
} from "../controllers/user/user.controller";

const router = Router();

router.get('/', getUsers);
router.get('/id/:id', getUserById);
router.get('/username/:username', getUserByUsername);
router.get('/me', getMe);

router.patch('/changePassword', changePassword)
router.patch('/edit', editProfile);

router.delete('/delete', deleteUser);

module.exports = router;