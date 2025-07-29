import pool from '../config/db';
import { generateJwtToken } from '../utils/jwtGeneration';
import {passwordHashing, passwordVerification} from '../utils/passwordHashing';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import sharp from 'sharp';

const storage = multer.memoryStorage();
const upload = multer({ storage });

// user registration controller
export const registerUser = async(req,res)=>{
    const {id, name, userName, email, password} = req.body;

    try {
        // check wheter user exists
        const [doesUserExists]  = await pool.query('SELECT email FROM users WHERE email  = ?',[email]);
        
        // chech whether username exists
        const [doesUserNameExists] = await pool.query('SELECT userName FROM users WHERE userName  = ?',[userName]);
        if((doesUserNameExists as any[]).length>0)
            return res.status(200).json({msg:"User name already exists."});

        if((doesUserExists as any[]).length === 0){
            const hashPassword = await passwordHashing(password);
            
            await pool.query('INSERT INTO users (id, name, userName, email,password) VALUES (?, ?, ?, ?, ?)',[id, name, userName,email,hashPassword]);
            // generate jwt token
            const token = generateJwtToken(id, userName);
            res.cookie("token",token);
           
            res.status(201).json({ message: 'User added successfully' , token});
        } 
        else{
            res.status(200).json({msg:"User already exists."});
        }
    } 
    catch (error) {
        res.status(500).json({ error: 'Database error', details: error });    
    }
}


// user login controller
export const loginUser = async(req,res)=>{
    const {email, password} = req.body;

    try {
        // check wheter user exists
        const [doesUserExists]  = await pool.query('SELECT id, userName, password FROM users WHERE email  = ?',[email]);
        
        if((doesUserExists as any[]).length > 0){
            const isPasswordCorrect = await passwordVerification(password, (doesUserExists as any[])[0].password);

            if(isPasswordCorrect){
                
                const token = generateJwtToken((doesUserExists as any[])[0].id, (doesUserExists as any[])[0].userName);

                res.cookie("token",token);
                res.status(201).json({ message: 'User login successfully', token });
            }
            else{
                res.status(200).json({msg:"Invalid password."});
            }
        } 
        else{
            res.status(200).json({msg:"No user found."});
        }
    } 
    catch (error) {
        res.status(500).json({ error: 'Database error', details: error });    
    }
}

// user profile controller
export const getUserProfile = async(req,res)=>{
    const user = req.user;
    res.status(200).json({user});
}

// user logout controller
export const logoutUser = async(req,res)=>{
    res.clearCookie("token");

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    const blackListToken = await pool.query('INSERT INTO blockListToken (token) VALUES (?)',[token]);
    res.status(200).json({message:"User logged out successfully"});
}

// user post controller
// Updated: expects image file in req.file
export const createPost = async (req, res) => {
    const { restaurantName, title, description, isPrivate, foodQuality, ambience, service, valueForMoney } = req.body;
    const userId = req.user.id;
    const postId = uuidv4();
    const ratingId = uuidv4();

    try {
        // Insert post and rating as before
        await pool.query('INSERT INTO posts (postId, restaurantName, title, description, isPrivate, userId) VALUES (?, ?, ?, ?, ?, ?)', [postId, restaurantName, title, description, isPrivate, userId]);
        await pool.query('INSERT INTO foodRating (ratingId, foodQuality, ambience, service, valueForMoney, postId) VALUES (?, ?, ?, ?, ?, ?)', [ratingId, foodQuality, ambience, service, valueForMoney, postId]);

        // Handle image upload if present
        if (req.file) {
            const mediaId = uuidv4();
            // Compress image using sharp
            const compressedImage = await sharp(req.file.buffer)
                .resize({ width: 800 }) // Example resize, adjust as needed
                .jpeg({ quality: 70 })
                .toBuffer();

            await pool.query(
                'INSERT INTO media (mediaId, postId, fileName, mimeType, size, compressedImage) VALUES (?, ?, ?, ?, ?, ?)',
                [mediaId, postId, req.file.originalname, req.file.mimetype, compressedImage.length, compressedImage]
            );
        }

        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
};

export const getImage = async (req, res) => {
    const { mediaId } = req.params;
    try {
        const [rows]: any = await pool.query(
            'SELECT mimeType, compressedImage FROM media WHERE mediaId = ?',
            [mediaId]
        );
        if (!rows.length) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const { mimeType, compressedImage } = rows[0];
        res.set('Content-Type', mimeType);
        res.send(compressedImage);
    } catch (error) {
        res.status(500).json({ error: 'Database error', details: error });
    }
};

// Export upload middleware for use in route
export { upload };
