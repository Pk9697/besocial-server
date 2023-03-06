import User from "../../../models/user.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import fileDirName from "../../../utils/file-dir-name.js";

const { __dirname, __filename } = fileDirName(import.meta);

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { email, password, confirm_password, name } = req.body;
    if (password !== confirm_password) {
      return res.status(422).json({
        success: false,
        message: "Password and Confirm Password not same",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const newUser = await User.create({
      email,
      password,
      name,
    });

    return res.status(201).json({
      success: true,
      message: "Register successful here is your token keep it safe",
      data: {
        token: jwt.sign(newUser.toJSON(), "besocial", { expiresIn: "1d" }),
        newUser,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/*LOGIN*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({
        success: false,
        message: "User Doesn't Exist",
      });
    }
    if (user.password !== password) {
      return res.status(422).json({
        success: false,
        message: "Password wrong",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Login successful here is your token keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), "besocial", { expiresIn: "1d" }),
        user,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* GET USER PROFILE -requires authentication*/
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(422).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetch successful",
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* UPDATE OWN PROFILE-reqiuires authentication and authorization */

export const updateOwnProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(422).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user.id !== userId) {
      return res.status(422).json({
        success: false,
        message: "You are not authorized to update other user's profile",
      });
    }

    User.uploadedAvatar(req, res, async function (err) {
      if (err) {
        console.log("********Multer error: ", err);
      }
      const { email, password, name } = req.body;

      const userExists = await User.findOne({ email: email });
      if (userExists) {
        return res.status(422).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      name && (user.name = name);
      email && (user.email = email);
      password && (user.password = password);

      if (req.file) {
        if (
          user.avatar &&
          fs.existsSync(path.join(__dirname, "../../../", user.avatar))
        ) {
          fs.unlinkSync(path.join(__dirname, "../../../", user.avatar));
        }
        //*so works with '/' also
        user.avatar = User.avatarPath + `/` + req.file.filename;
      }

      await user.save();

      return res.status(200).json({
        success: true,
        message: "User Updated successfully",
        data: {
          user,
        },
      });
    });
    //!doesnt work if form body is multipart 
    // const updatedUser=await User.findByIdAndUpdate(userId,req.body,{new:true})
    // return res.status(200).json(
    //   {
    //     success: true,
    //     message: "User Updated successfully",
    //     data:{
    //       user:updatedUser
    //     }
    //   }
    // )
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};