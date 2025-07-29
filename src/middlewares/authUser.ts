import jwt from 'jsonwebtoken';
import pool from '../config/db';

export const verifyToken = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // check whether token is provided
    if(!token)
        return res.status(401).json({message:"Access denied. No token provided"});

    // check whether token is blacklisted
    const isBlackListed = await pool.query('SELECT * FROM blockListToken WHERE token = ?',[token]);
    // console.log(isBlackListed);
    
    if((isBlackListed as any[])[0].length > 0)
        return res.status(401).json({message:"Unauthorized access"});

    // verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const userName = decoded.userName;
        const doesUserExists = await pool.query('SELECT * FROM users WHERE userName = ?',[userName]);

        if(!doesUserExists)
            return res.status(401).json({message:"No such user found"});

        req.user = (doesUserExists as any[])[0][0];
        next();
    }
    catch(error){
        return res.status(401).json({message:"Invalid token"});
    }

}

