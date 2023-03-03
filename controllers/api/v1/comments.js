import Post from "../../../models/post.js";
import Comment from "../../../models/comment.js";
export const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(422).json({
        success: false,
        message: "Post for this comment not found!",
      });
    }

    const comment = await Comment.create({
      content,
      user: req.user._id,
      post: postId,
    });
    //!comment id should be pushed or whole comment obj i think id would be correct
    //cos we are storing objectId in post.comments and then populating each post comment on posts controller
    // post.comments.push(comment._id)
    //spread operator takes linear time whereas push takes o(1) time but while retrieving comments we want recent first so we are inc tc for retrieving
    post.comments = [comment._id, ...post.comments];
    post.save();

    return res.status(200).json({
      success: true,
      message: "Comment on this post created successfully!",
      comment,
      post,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
