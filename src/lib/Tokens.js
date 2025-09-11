import crypto from 'crypto';
import jwt from "jsonwebtoken"
export let refreshToken = ()=>{
    let secretKey  = crypto.randomBytes(64).toString('hex');
    let refreshToken = jwt.sign({refreshToken : "RefreshToken"},secretKey,{expiresIn : "7d"})
    return refreshToken
}
export let accessToken = ()=>{
    let secretKey  = crypto.randomBytes(64).toString('hex');
    let refreshToken = jwt.sign({accessToken : "accessToken"},secretKey,{expiresIn : "15m"})
    return refreshToken
}