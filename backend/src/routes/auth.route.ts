import { signup, signin } from "../controllers/auth/auth.controller";
import { Router } from "express";

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin)


module.exports = router;