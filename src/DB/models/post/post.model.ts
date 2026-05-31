import { model, Schema} from "mongoose";
import { IPost } from "../../../common";
import { commentRepo } from "../comment/comment.repository";



const schema = new Schema<IPost>({

    userId:{type: Schema.Types.ObjectId , required:true , ref: "User"},
    content: String,
    attachments: [{secure_url:String,public_id:String}],
    reactionCount : Number,
    commentCount: Number
    
},{timestamps:true})

schema.pre("deleteOne", async function(){
    const filter = this.getFilter()
    const replies = await commentRepo.getAll({postId: filter._id})

    if(replies?.length > 0){

          for (const reply of replies) {
        await commentRepo.delete({_id:reply._id})
    }

    }
  
})

export const Post = model("Post",schema)