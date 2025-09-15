import User from "../../models/userModel"
import bcrypt from "bcrypt"
import { httpStatus } from "../../constants/httpStatus"
import { generateToken } from "../../utils/JWT/generateToken"

const getRegister = (req, res) => {
    res.status(200).json({ message: "success", page: "register page" })
    return
}

const postRegister = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body

        //validate require fields
        if (!name || !mobile || !password) {
            res.status(httpStatus.BAD_REQUEST).json({ mission: "failed", message: "some Credential is null" });
            return;
        }

        //check if user already exists
        const findUser = await User.findOne(email ? { $or: [{ email }, { mobile  }] } : { mobile })

        if (findUser) {
            res.status(httpStatus.CONFLICT).json({
                mission: "failed",
                message: "User already exists"
            })
            return;
        }

        //hasing password using bcrypt
        let hasedPassword = await bcrypt.hash(password, 10);
        
        //create new user
        const newUser = new User({
            name: name,
            email: email,
            password: hasedPassword,
            mobile: mobile
        })

        await newUser.save();

        res.status(httpStatus.CREATED).json({
            mission: "successful", message: "New User Added Successfully"
        })

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            mission: "failed",
            message: "internal server",
            error: error.message
        });
    }
};

const getLogin = (req, res) => {
    res.status(httpStatus.OK).json({
        mission: "success", message: "welcome to login Page"
    })
    return;
}

const postLogin=async (req,res)=>{
    try {
        const {email,mobile,password}=req.body;

        //validate require fields
        if((!email||!mobile)||!password){
            res.status(httpStatus.BAD_REQUEST).json({
                mission:"failed",
                message:"one of credential is null"
            });
            return;
        }

        //finding user from data base
        const user=await User.findOne(email?{$or:[{email},{mobile}]}:{mobile})
        if(!user){
            res.status(httpStatus.NOT_FOUND).json({
                mission:"failed",
                message:"user not fount"
            })
            return;
        }

        //password checking

        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(httpStatus.UNAUTHORIZED).json({
                mission:"failed",
                message:"Invalid password"
            })
        }

        //tocken generation
        const token=generateToken(user)

        res.status(httpStatus.OK).json({
            mission:"success",
            message:"user login successfully",
            token:token,
            user:user
        })
        return;
        
    } catch (error) {
         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            mission: "failed",
            message: "internal server",
            error: error.message
        });
    }
}

export {
    getRegister,
    postRegister,
    getLogin,
    postLogin
}
