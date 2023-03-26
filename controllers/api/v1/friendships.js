import jwt from 'jsonwebtoken'
import Friendship from '../../../models/friendship.js'
import User from '../../../models/user.js'

export const toggleFriendship = async (req, res) => {
	try {
		//friendship/toggle/:friendId
		const { friendId } = req.params
		let deleted = false
		const friend = await User.findById(friendId)
		if (!friend) {
			return res.status(422).json({
				success: false,
				message: "Friend doesn't exist",
			})
		}
		if (req.user.id === friendId) {
			return res.status(422).json({
				success: false,
				message: 'You cannot be a friend to yourself!',
			})
		}
		const user = await User.findById(req.user._id)
		//check if already friends
		const existingFriends = await Friendship.findOne({
			from_user: req.user._id,
			to_user: friendId,
		})
		// if(!existingFriends){
		//     existingFriends=await Friendship.findOne({from_user:friendId,to_user:req.user._id})
		// }
		if (!existingFriends) {
			const newFriendship = await Friendship.create({
				from_user: req.user._id,
				to_user: friendId,
			})
			//?should i push in friend.friendship too? acc to Arpan yes
			user.friends.push(newFriendship._id)
			user.save()
			// friend.friends.push(newFriendship._id)
			// friend.save()
			deleted = false
		} else {
			//else remove this friend
			user.friends.pull(existingFriends._id)
			// friend.friends.pull(existingFriends._id)
			user.save()
			await Friendship.findByIdAndDelete(existingFriends._id)
			deleted = true
		}

		return res.status(200).json({
			success: true,
			message: 'Request successful!',
			data: {
				deleted,
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

export const getAllUserFriends = async (req, res) => {
	try {
		const friends = await Friendship.find({ from_user: req.user._id }).populate(
			'to_user'
		)
		return res.status(200).json({
			success: true,
			message: `List of friends for user id ${req.user._id}`,
			data: {
				friends,
			},
		})
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error!',
		})
	}
}
/* api/v1/friendship/create_friendship?user_id=<user_id> */
export const createFriendship = async (req, res) => {
	try {
		const { user_id } = req.query
		const user = await User.findById(user_id)
		if (!user) {
			return res.status(422).json({
				success: false,
				message: 'User you are trying to add as a friend does not exist!',
			})
		}

		//check if already friends
		const alreadyFriends = await Friendship.findOne({
			from_user: req.user._id,
			to_user: user_id,
		})

		if (alreadyFriends) {
			return res.status(422).json({
				success: false,
				message: 'Already a friend!',
			})
		}

		const newFriendship = await Friendship.create({
			from_user: req.user._id,
			to_user: user_id,
		})

		// await newFriendship.populate('from_user').populate('to_user')
		const populateFriendship = await Friendship.findById(newFriendship._id)
			.populate('from_user')
			.populate('to_user')
		//?should i push in friend.friendship too? acc to Arpan yes
		const loggedInUser = await User.findById(req.user._id)
		loggedInUser.friends.push(newFriendship._id)
		loggedInUser.save()
		// friend.friends.push(newFriendship._id)
		// friend.save()
		// deleted = false

		return res.status(200).json({
			success: true,
			message: `Now you are friends with ${user.name}`,
			data: {
				friendship: populateFriendship,
				loggedInUser,
				token: jwt.sign(loggedInUser.toJSON(), 'besocial', { expiresIn: '1d' }),
			},
		})
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: `Internal Server Error! ${err}`,
		})
	}
}
/* api/v1/friendship/remove_friendship?user_id=<user_id> */
export const removeFriendship = async (req, res) => {
	try {
		const { user_id } = req.query
		const user = await User.findById(user_id)
		if (!user) {
			return res.status(422).json({
				success: false,
				message: 'User you are trying to remove as a friend does not exist!',
			})
		}

		//check if already friends
		const alreadyFriends = await Friendship.findOne({
			from_user: req.user._id,
			to_user: user_id,
		})

		if (!alreadyFriends) {
			return res.status(422).json({
				success: false,
				message: 'Not a friend!',
			})
		}

		const loggedInUser = await User.findById(req.user._id)
		//remove this friend
		loggedInUser.friends.pull(alreadyFriends._id)
		// friend.friends.pull(existingFriends._id)
		loggedInUser.save()
		await Friendship.findByIdAndDelete(alreadyFriends._id)

		return res.status(200).json({
			success: true,
			message: `${user.name} removed from friends`,
			data: {
				loggedInUser,
				token: jwt.sign(loggedInUser.toJSON(), 'besocial', { expiresIn: '1d' }),
			},
		})
	} catch (err) {
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error!',
		})
	}
}
