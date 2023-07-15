import mongoose from 'mongoose'
import env from './environment.js'

const uri = process.env.BESOCIAL_MONGODB_URI

//connect to database
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: env.db,
})

//acquire the connection (to check if it is successful)
// this db name will be used to access our database or verify if mongodb server is connected to our database or not
const db = mongoose.connection
db.on('error', console.log.bind(console, 'Error connecting to db'))
db.once('open', function () {
	console.log('Connected to Database "" MongoDB')
})

export default db
