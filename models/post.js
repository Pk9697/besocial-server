import mongoose from 'mongoose'
import multer from 'multer'
import path from 'path'
import fileDirName from '../utils/file-dir-name.js'
const { __dirname, __filename } = fileDirName(import.meta)
const POST_IMG_PATH = path.join('/uploads/posts')
const postSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			// required: true,
		},
		//will refer to object Id of a user who posted with reference to User Schema
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		//include the array of ids of all comments in this post schema itself for fetching comments for a particular post faster
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
		//include the array of ids of all likes in this post schema itself for fetching likes for a particular post faster
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Like',
			},
		],

		postImg: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
)

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', POST_IMG_PATH))
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	},
})

postSchema.statics.uploadedPostImg = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		const uploadType = file.mimetype.split("/")[0];
		if (uploadType !== 'image') {
			return callback(new Error('Only images are allowed'))
		}
		callback(null, true)
	}
}).single('postImg')

postSchema.statics.postImgPath = POST_IMG_PATH
//telling mongoose that this->'Post' is a model in the database
const Post = mongoose.model('Post', postSchema)
//now exporting this Post schema which would be used by controllers to access Post model document
export default Post
