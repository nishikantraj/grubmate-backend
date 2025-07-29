import express from 'express';
import {createPost, getUserProfile, loginUser, logoutUser, registerUser, upload, getImage} from '../controllers/user.controller';
import zod from 'zod';
import { verifyToken } from '../middlewares/authUser';

const router = express();

// user registration schema validation
const userRegistrationSchema = zod.object({
    name: zod.string().min(3, {message: "Name must be at least 3 characters long."}),
    userName:zod.string().min(3, {message: "User name must be at least 3 characters long."}),
    email:zod.string().email({message: "Invalid email address."}),
    password:zod.string().min(6, {message: "Password must be at least 6 characters long."}),
})

// user login schema validation
const userLoginSchema = zod.object({
    email:zod.string().email({message: "Invalid email address."}),
    password:zod.string().min(6, {message: "Password must be at least 6 characters long."}),
});

// user registration validation middleware
const registerUserValidation = (req,res,next)=>{
    const data = userRegistrationSchema.safeParse(req.body);
    const {error} = userRegistrationSchema.safeParse(req.body);
    if(error){
        return res.status(400).json({error: error.message});
    }
    next();
}

// user login validation middleware
const loginUserValidation = (req,res,next)=>{
    const {error} = userLoginSchema.safeParse(req.body);

    if(error){
        return res.status(400).json({error: error.message});
    }
    next();
}

router.post('/register',registerUserValidation,registerUser);
router.post('/login',loginUserValidation,loginUser);
router.get('/profile',verifyToken,getUserProfile);
router.post('/logout',verifyToken,logoutUser);
router.post('/post',verifyToken,upload.single('image'),createPost);
router.get('/getimage/:mediaId', getImage);
export default router;