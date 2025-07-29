import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export const generateJwtToken = (userId:number, userName:string):string =>{
    const token = jwt.sign(
        {id:userId,userName},
        process.env.JWT_SECRET as string,
        {expiresIn: '1h'}
    );
    return token;
};