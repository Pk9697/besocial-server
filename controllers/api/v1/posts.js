import Comment from "../../../models/comment.js";
import Post from "../../../models/post.js";
import Like from "../../../models/like.js";
/* CREATE POST- requires authentication */
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.create({
      content,
      //user is already set by passport.authenticate method which was used as a mw
      user: req.user._id,
    });
    if (post) {
      const userPopulatedPost = await post.populate("user");
      return res.status(200).json({
        success: true,
        message: "Post created successfully!",
        data:{
          post: userPopulatedPost,
        }
      });
    }

    return res.status(422).json({
      success: false,
      message: "Unable to create Post!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* GET ALL POSTS -no authentication is required*/
export const getAllPosts = async (req, res) => {
  try {
    //gets all the posts with recent posts first
    const posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "likes",
          populate: {
            path: "user",
          },
        },
      })
      .populate({
        path: "likes",
        populate: {
          path: "user",
        },
      });
    return res.status(200).json({
      success: true,
      message: "List of posts of v1",
      data:{
        posts
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/*DELETE A POST -requires authentication */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(422).json({
        success: false,
        message: "Post doesn't exist",
      });
    }
    //authorize user
    //.id means converting object id into string so that 2 strings can be compared otherwise 2 object ids alwaya gives false
    // console.log(toString(post.user),req.user._id)
    //*compare 2 object ids using .equals
    if (!post.user.equals(req.user._id)) {
      return res.status(422).json({
        success: false,
        message: "You are not authorized to delete this Post!",
      });
    }

    // post.remove()
    await Comment.deleteMany({ post: postId });
    await Like.deleteMany({likeable:postId,onModel:'Post'})
    //!check if it works
    await Like.deleteMany({likeable:{$in:post.comments},onModel:'Comment'})
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post and associated comments and likes deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
