import User from "../../../models/user.js";
import jwt from "jsonwebtoken";

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
    const user = User.findOne({ email });
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
        token:jwt.sign(user.toJSON(), 'besocial', { expiresIn: "1d" }),
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
