import { model, Schema } from "mongoose";
import { IStory } from "../../../common/interFaces/story.interface";
import { userReactionRepo, UserReactionRepository } from "../user-reaction/user-reaction.repository";


const schema = new Schema<IStory>({
    userId:{type: Schema.Types.ObjectId , required:true , ref: "User"},
    content: String,
    attachment: {secure_url:String,public_id:String},
    reactionCount : Number,
    expiresAt: {
  type: Date,
  default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
}
   
},{timestamps:true})


schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

schema.pre("deleteOne", async function(){

    const filter = this.getFilter()
    
     const reactions = await userReactionRepo.getAll({refId : filter._id})

        if(reactions.length > 0){
    
              for (const reaction of reactions) {
            await userReactionRepo.delete({_id:reaction._id})
        }
    
        }
})

export const Story = model("Story",schema)