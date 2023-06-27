import { signup, signin, validateUsername } from "../controllers/auth/auth.controller";
import { Router } from "express";

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/checkUsername/:username', validateUsername);

module.exports = router;