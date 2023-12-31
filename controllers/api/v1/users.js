import User from '../../../models/user.js'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import fileDirName from '../../../utils/file-dir-name.js'
import env from '../../../config/environment.js'

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

		const { password: pass, ...newUserWithoutPass } = newUser?._doc
		// console.log({newUserWithoutPass})

		return res.status(201).json({
			success: true,
			message: 'Register successful here is your token keep it safe',
			data: {
				token: jwt.sign(newUserWithoutPass, env.jwt_secret_key, {
					expiresIn: '1d',
				}),
				user: newUserWithoutPass,
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
		const user = await User.findOne({ email })
			.select('+password')
			.populate({
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

		const { password: pass, ...userWithoutPass } = user?._doc
		// console.log({ userWithoutPass })

		return res.status(200).json({
			success: true,
			message: 'Login successful here is your token keep it safe',
			data: {
				token: jwt.sign(userWithoutPass, env.jwt_secret_key, {
					expiresIn: '1d',
				}),
				user: userWithoutPass,
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

		const { password: pass, ...userWithoutPass } = user?._doc

		return res.status(200).json({
			success: true,
			message: 'Authentication successful!',
			data: {
				// token: jwt.sign(user.toJSON(), env.jwt_secret_key, { expiresIn: '1d' }),
				user: userWithoutPass,
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

		//* Extract Pass Not needed here
		// const { password: pass, ...userWithoutPass } = user?._doc

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
				return res.status(422).json({
					success: false,
					message: err.message,
				})
			}
			const {
				email,
				password,
				confirmPassword: confirm_password,
				name,
				userId,
			} = req.body
			// console.log(userId)
			const user = await User.findById(userId)
				.select('+password')
				.populate({
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

			//TODO old password check but first update front end for addding this input field

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
			
			const file = req.file
			if (file) {
				if (
					user.avatar &&
					fs.existsSync(path.join(__dirname, '../../../', user.avatar))
				) {
					//DELETE prev file
					fs.unlinkSync(path.join(__dirname, '../../../', user.avatar))
				}

				const stats = fs.statSync(file.path)
				const fileSizeInBytes = stats.size;
				// Convert the file size to megabytes 
				const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
				let quality = 100;
				
				if (fileSizeInMegabytes > 10) {
					quality=10
				} else if (fileSizeInMegabytes > 5 && fileSizeInMegabytes <= 10) {
					quality=20
				} else if (fileSizeInMegabytes > 1 && fileSizeInMegabytes <= 5) {
					quality=30
				} else if (fileSizeInMegabytes > 0.5 && fileSizeInMegabytes <= 1) {
					quality=50
				}

				const newFileName = file.fieldname + '-' + Date.now()
				const newFilePath = path.join(file.destination, newFileName)
				// console.log({ file, newFileName })

				await sharp(file.path)
					// .resize()
					.jpeg({ quality: quality })
					// .toFormat('jpeg', { mozjpeg: true })
					.toFile(newFilePath)

				if (fs.existsSync(file.path)) {
					fs.unlinkSync(file.path)
				}
				//*so works with '/' also
				user.avatar = User.avatarPath + `/` + newFileName
			}

			await user.save()

			const { password: pass, ...userWithoutPass } = user?._doc

			return res.status(200).json({
				success: true,
				message: 'User Updated successfully',
				data: {
					token: jwt.sign(userWithoutPass, env.jwt_secret_key, {
						expiresIn: '1d',
					}),
					user: userWithoutPass,
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
