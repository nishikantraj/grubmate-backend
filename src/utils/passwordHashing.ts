import bcrypt from 'bcrypt';

export const passwordHashing = async(password:string):Promise<string> =>{
    const salt = await bcrypt.genSalt(10);
    
    const hashPassword = await bcrypt.hash(password,salt);
    return hashPassword;
}

export const passwordVerification = async(password:string,hashPassword:string):Promise<boolean> =>{
    const isPasswordCorrect = await bcrypt.compare(password,hashPassword);
    return isPasswordCorrect;
}