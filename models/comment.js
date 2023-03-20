import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		//will refer to object Id of a user who posted with reference to User Schema
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		//will refer to object Id of a post where this comment was created with reference to Post Schema
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
		//include the array of ids of all likes in this comment schema itself for fetching likes for a particular comment faster
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Like',
			},
		],
	},
	{
		timestamps: true,
	}
)
//telling mongoose that this->'Comment' is a model in the database
const Comment = mongoose.model('Comment', commentSchema)
//now exporting this Comment schema which would be used by controllers to access Comment model document
export default Comment
