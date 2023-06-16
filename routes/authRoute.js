import express from 'express'
import {registerController,loginController,testController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
//router object
const router = express.Router()

//routing 
//Register
router.post('/register',registerController);

//LOGIN
router.post('/login',loginController);

//testroutes

router.get('/test',requireSignIn,isAdmin,testController);

//protected route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

export default router;
