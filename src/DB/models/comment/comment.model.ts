import { model, Schema, Types } from "mongoose";
import { IComment } from "../../../common";

const schema = new Schema<IComment>({
    userId:{type:Types.ObjectId , ref:"User" , required:true},
    postId:{type:Types.ObjectId , ref:"Post" , required:true},
    parentId:{type:Types.ObjectId , ref:"Comment"},
    mentions: [{type:Types.ObjectId, ref:"User"}],
    content: String,
    attachment:String,
    reactionCount : Number

},{timestamps:true})

schema.pre("deleteOne", async function(){
    const filter = this.getFilter()
    console.log(filter);
    

    const replies = await this.model.find({parentId : filter._id})

    if(replies.length > 0){

          for (const reply of replies) {
        await this.model.deleteOne({_id:reply._id})
    }

    }
  
})


export const Comment = model("Comment", schema)