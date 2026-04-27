import { model, Schema} from "mongoose";
import { IPost } from "../../../common";



const schema = new Schema<IPost>({

    userId:{type: Schema.Types.ObjectId , required:true , ref: "User"},
    content: String,
    attachments: [String],
    reactionCount : Number,
    commentCount: Number
    
},{timestamps:true})

export const Post = model("Post",schema)