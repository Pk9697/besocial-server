import Chat from '../../../models/chat.js'

export const createChat = async (req, res) => {
	try {
		const { content, chatRoom } = req.body
		const chat = await Chat.create({
			content,
			user: req.user._id,
			chatRoom,
		})
		if (chat) {
			const userPopulatedChat = await chat.populate('user')
			return res.status(200).json({
				success: true,
				message: 'Chat created successfully!',
				data: {
					chat: userPopulatedChat,
				},
			})
		}

		return res.status(422).json({
			success: false,
			message: 'Unable to create Chat!',
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		})
	}
}

export const getChatRoomChats = async (req, res) => {
	try {
		const { chatRoom } = req.query
		const chats = await Chat.find({ chatRoom }).populate('user')
		return res.status(200).json({
			success: true,
			message: `Here are your chats for this ${chatRoom}!`,
			data: {
				chats,
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
