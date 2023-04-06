import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import fileDirName from '../../../utils/file-dir-name.js'

const { __dirname, __filename } = fileDirName(import.meta)

/* REGISTER */
export const register = async (req, res) => {
	try {
		const { email, password, confirm_password, name } = req.body
		if (password !== confirm_password) {
			return res.status(422).json({
				success: false,
				message: 'Password and Confirm Password not same',
			})
		}
		const user = await User.findOne({ email })
		if (user) {
			return res.status(422).json({
				success: false,
				message: 'User Already Exists',
			})
		}

		const newUser = await User.create({
			email,
			password,
			name,
		})

		return res.status(201).json({
			success: true,
			message: 'Register successful here is your token keep it safe',
			data: {
				token: jwt.sign(newUser.toJSON(), 'besocial', { expiresIn: '1d' }),
				user: newUser,
			},
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}

/*LOGIN*/
export const login = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email }).populate({
			path: 'friends',
			populate: {
				path: 'to_user',
			},
		})
		if (!user) {
			return res.status(422).json({
				success: false,
				message: "User Doesn't Exist",
			})
		}
		if (user.password !== password) {
			return res.status(422).json({
				success: false,
				message: 'Password wrong',
			})
		}
		return res.status(200).json({
			success: true,
			message: 'Login successful here is your token keep it safe',
			data: {
				token: jwt.sign(user.toJSON(), 'besocial', { expiresIn: '1d' }),
				user,
			},
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}

export const authenticateUser = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate({
			path: 'friends',
			populate: {
				path: 'to_user',
			},
		})

		return res.status(200).json({
			success: true,
			message: 'Authentication successful!',
			data: {
				// token: jwt.sign(user.toJSON(), 'besocial', { expiresIn: '1d' }),
				user,
			},
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}

/* GET USER PROFILE -requires authentication*/
export const getUserProfile = async (req, res) => {
	try {
		const { userId } = req.params
		const user = await User.findById(userId)
		if (!user) {
			return res.status(422).json({
				success: false,
				message: 'User not found',
			})
		}

		return res.status(200).json({
			success: true,
			message: 'User fetch successful',
			data: {
				user,
			},
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}

/* UPDATE OWN PROFILE-reqiuires authentication and authorization */

export const updateOwnProfile = async (req, res) => {
	try {
		// const { userId } = req.params
		// const user = await User.findById(userId)
		// if (!user) {
		// 	return res.status(422).json({
		// 		success: false,
		// 		message: 'User not found',
		// 	})
		// }

		// if (req.user.id !== userId) {
		// 	return res.status(422).json({
		// 		success: false,
		// 		message: "You are not authorized to update other user's profile",
		// 	})
		// }

		User.uploadedAvatar(req, res, async function (err) {
			if (err) {
				console.log('********Multer error: ', err)
			}
			const {
				email,
				password,
				confirmPassword: confirm_password,
				name,
				userId,
			} = req.body
			// console.log(userId)
			const user = await User.findById(userId).populate({
				path: 'friends',
				populate: {
					path: 'to_user',
				},
			})

			if (!user) {
				return res.status(422).json({
					success: false,
					message: 'User not found!',
				})
			}

			if (req.user.id !== userId) {
				return res.status(422).json({
					success: false,
					message: "You are not authorized to update other user's profile!",
				})
			}

			if (password !== confirm_password) {
				return res.status(422).json({
					success: false,
					message: 'Password & Confirm Password do not match!',
				})
			}

			const userExists = await User.findOne({ email: email })
			if (userExists && userExists.email !== user.email) {
				return res.status(422).json({
					success: false,
					message: 'User with this email already exists!',
				})
			}

			name && (user.name = name)
			email && (user.email = email)
			password && (user.password = password)

			if (req.file) {
				if (
					user.avatar &&
					fs.existsSync(path.join(__dirname, '../../../', user.avatar))
				) {
					fs.unlinkSync(path.join(__dirname, '../../../', user.avatar))
				}
				//*so works with '/' also
				user.avatar = User.avatarPath + `/` + req.file.filename
			}

			await user.save()

			return res.status(200).json({
				success: true,
				message: 'User Updated successfully',
				data: {
					token: jwt.sign(user.toJSON(), 'besocial', { expiresIn: '1d' }),
					user,
				},
			})
		})
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
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}

// GET ALL USERS except the user making req and his friends requires authentication
export const getAllUsers = async (req, res) => {
	try {
		// const currUser = await User.findById(req.user._id).populate({
		// 	path: 'friends',
		// 	populate: {
		// 		path: 'to_user',
		// 	},
		// })
		// const friends = currUser.friends
		// console.log(friends)
		const allUsers = await User.find()
		return res.status(200).json({
			success: true,
			message: 'All users',
			data: {
				users: allUsers,
			},
		})
		// const allUsers=await User.find({})
		// const allUsersExceptCurrLoggedInUser = allUsers.filter(
		// 	(user) => !user._id.equals(req.user._id)
		// )
		// const allUsersExceptCurrLoggedInUserAndFriends =
		// 	allUsersExceptCurrLoggedInUser.filter(
		// 		(user) => !friends.find((friend) => friend.to_user._id.equals(user._id))
		// 	)
		// console.log(allUsersExceptCurrLoggedInUser)
		// console.log(allUsersExceptCurrLoggedInUserAndFriends)

		// return res.status(200).json({
		// 	success: true,
		// 	message: 'All users except self and self friends',
		// 	data: {
		// 		users: allUsersExceptCurrLoggedInUserAndFriends,
		// 	},
		// })
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}

export const searchUser = async (req, res) => {
	try {
		let { searchText } = req.query
		searchText = `^${searchText}`
		const users = await User.find({
			name: { $regex: searchText, $options: 'i' },
		})
		return res.status(200).json({
			success: true,
			message: 'Here are your Search results!',
			data: {
				users,
			},
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}
