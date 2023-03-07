import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    //who liked it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //this defines the object id of the liked object whether post id,or comment id
    likeable: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    //this field is used for defining the type of the liked object since this is a dynamic referend
    onModel: {
      type: String,
      required: true,
      //enum tells that value of onModel for each Like can be either Post or Comment and nothing other than that
      enum: ["Post", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);

//telling mongoose that this->'Like' is a model in the database
const Like = mongoose.model("Like", likeSchema);
//now exporting this Like model
export default Like;
