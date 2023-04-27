import express from 'express'
import router from './routes/index.js'
import db from './config/mongoose.js'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import fileDirName from './utils/file-dir-name.js'
import bodyParser from 'body-parser'
import cors from 'cors'
import { createServer } from 'http'
import chatSockets from './config/chat_sockets.js'
const { __dirname, __filename } = fileDirName(import.meta)
// console.log(__dirname,__filename)
const port = 4001
const app = express()

const httpServer = createServer(app)
chatSockets(httpServer)
httpServer.listen(5000)

/* MIDDLEWARES */
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(express.bodyParser())

// app.use(passport.initialize());
// app.use(passport.session());
//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'))
//use express router
app.use('/', router)

/* RUN SERVER */
app.listen(port, function (err) {
	if (err) {
		console.log(`Error in running server : ${err}`)
	}

	console.log(`Server is running on port: ${port}`)
})
