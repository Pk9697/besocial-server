import mongoose from 'mongoose'
const chatSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		chatRoom: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Chat = mongoose.model('Chat', chatSchema)
export default Chat
