import jwt from 'jsonwebtoken'


export const generateToken=(user)=>{
    return jwt.sign(
        {_id:user._id,contact:user.email?user.email:user.mobile},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRES_IN}
    )
}

