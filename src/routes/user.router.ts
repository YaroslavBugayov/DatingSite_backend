import express from 'express';
import { userController } from '../controllers/user.controller';
import authMiddleware from "../middlewares/auth.middleware";
// import { body } from 'express-validator'

const router = express.Router();

router.post('/register',
    // body('email').isEmail,
    // body('username').isLength({ min: 3, max: 20 }),
    // body('password').isLength({ min: 5, max: 50 }),
    userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);

export default router;