import express from 'express'
import {registerController,loginController,testController,forgotPasswordController,updateProfileController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
//router object
const router = express.Router()

//routing 
//Register
router.post('/register',registerController);

//LOGIN
router.post('/login',loginController);

//Forgot Password ||Post
router.post('/forgot-password',forgotPasswordController)

//testroutes

router.get('/test',requireSignIn,isAdmin,testController);

//protected user route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

//protected Admin route auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});
//update profile
router.put('/profile',requireSignIn,updateProfileController)
export default router;
