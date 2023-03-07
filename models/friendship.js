import mongoose from "mongoose"

const friendshipSchema=new mongoose.Schema(
    {
        //the user who sent this request
        from_user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        },
        //the user who accepted this request
        to_user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        }
    },{
        timestamps:true
    }
)

const Friendship=mongoose.model('Friendship',friendshipSchema)
export default Friendship