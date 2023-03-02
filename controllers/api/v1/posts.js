import Post from "../../../models/post.js";

/* CREATE POST- requires authentication */
export const createPost=async (req,res)=>{
    try {
        const {content}=req.body
        const post=await Post.create({
            content,
            //user is already set by passport.authenticate method which was used as a mw
            user:req.user._id
        })
        if(post){
            const userPopulatedPost=await post.populate('user')
            return res.status(200).json(
                {
                    success:true,
                    message:'Post created successfully!',
                    post:userPopulatedPost
                }
            )
        }

        return res.status(422).json(
            {
                success:false,
                message:'Unable to create Post!',
            }
        )
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
}

/* GET ALL POSTS -no authentication is required*/
export const getAllPosts=async (req,res)=>{
    try {
        //gets all the posts with recent posts first
        const posts=await Post.find({}).sort('-createdAt').populate('user')
        return res.status(200).json({
            success:true,
            message:"List of posts of v1",
            posts
        });
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
}