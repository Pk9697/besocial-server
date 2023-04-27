import { Server } from 'socket.io'
export default function chatSockets(socketServer) {
	const io = new Server(socketServer, {
		cors: {
			origin: 'http://127.0.0.1:5173',
		},
	})
	io.on('connection', (socket) => {
		console.log('new connection received', socket.id)
		socket.on('disconnect', () => console.log('socket disconnected!'))
		socket.on('join_room', (data) => {
			console.log('joining req received...!', data)
			socket.join(data.chatroom)
			io.in(data.chatroom).emit('user_joined', data)
		})
		socket.on('send_msg', (data) => {
			console.log('send msg received...!')
			io.in(data.chatroom).emit('receive_msg', data)
		})
	})
}
