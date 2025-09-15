import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
  },
  mobile: {
    type: String,
    require: true,
    unique: true,
  },
  password:{
    type:String,
  },
  isBlocked:{
    type:Boolean,
    require:true,
    default:false,
  },
  referralCode:{
    type:String,
    unique:true,
    sparse:true,
    default:null
  }
});

userSchema.pre('save',async function (next) {
    if(!this.referralCode){
        let code;
        let exists;
        const model=this.constructor;

        do{
            code=Math.random().toString(36).substring(2,8).toUpperCase()
            exists=await model.findOne({referralCode:code})
        }while(exists)
        
        this.referralCode=code;
    }
    next()
});

userSchema.statics.generateReferralCode= async function (){
    let code;
    let exists;

    do{
        code=Math.random().toString(36).substring(2,8).toUpperCase();
        exists=await this.findOne({referralCode:code})
    }while(exists)

    return code
};

const User=mongoose.model('User',userSchema);
export default User;