import mongoose from "mongoose";
import multer from "multer"
import path from "path"
import fileDirName from "../utils/file-dir-name.js";
const {__dirname,__filename}=fileDirName(import.meta)
// console.log(__dirname,__filename)
const AVATAR_PATH=path.join('/uploads/users/avatars')
// console.log(path.join(__dirname,'..',AVATAR_PATH))

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.join(__dirname,'..',AVATAR_PATH))
  },
  filename:function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now())
  }
})

//static fxns or methods which will be accessed in usersController update fxn
//.single ensures only 1 file will be uploaded with the fieldname avatar
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar')
userSchema.statics.avatarPath=AVATAR_PATH

//telling mongoose that this->'User' is a model in the database
const User = mongoose.model("User", userSchema);
//now exporting this User schema
export default User;
