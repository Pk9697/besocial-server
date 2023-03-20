import Comment from '../../../models/comment.js'
import Like from '../../../models/like.js'
import Post from '../../../models/post.js'

export const toggleLike = async (req, res) => {
	try {
		//id can be postId or commentId depending upon type
		//likes/toggle/?id=efnksk&type=Post
		const { id, type } = req.query
		let likeable
		let deleted = false
		if (type === 'Post') {
			likeable = await Post.findById(id).populate('likes')
		} else {
			likeable = await Comment.findById(id).populate('likes')
		}

		//check if a like already exists
		const existingLike = await Like.findOne({
			likeable: id,
			onModel: type,
			user: req.user._id,
		})

		//if a like already exists then delete it
		if (existingLike) {
			likeable.likes.pull(existingLike._id)
			likeable.save()
			// existingLike.remove()
			await Like.findByIdAndDelete(existingLike._id)
			deleted = true
		} else {
			//else make a new Like
			const newLike = await Like.create({
				user: req.user._id,
				likeable: id,
				onModel: type,
			})
			likeable.likes.push(newLike._id)
			likeable.save()
			deleted = false
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
