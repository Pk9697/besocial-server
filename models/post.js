import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    //will refer to object Id of a user who posted with reference to User Schema
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //include the array of ids of all comments in this post schema itself for fetching comments for a particular post faster
    comments:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
      }
    ]
  },
  {
    timestamps: true,
  }
);
//telling mongoose that this->'Post' is a model in the database
const Post = mongoose.model("Post", postSchema);
//now exporting this Post schema which would be used by controllers to access Post model document
export default Post;
