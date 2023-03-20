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
