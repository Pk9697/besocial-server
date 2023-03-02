import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    //will refer to object Id of a user who posted with referance to User Schema
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
//telling mongoose that this->'Post' is a model in the database
const Post = mongoose.model("Post", postSchema);
//now exporting this Post schema which would be used by controllers to access Post model document
export default Post;
