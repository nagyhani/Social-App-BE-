import { model, Schema } from "mongoose";
import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE , IUser } from "../../../common";
import { commentRepo } from "../comment/comment.repository";
import { postRepo } from "../post/post.repository";
import { requestRepo } from "../request/request.repository";
import { userFriendRepo } from "../user-friend/user-friend.repository";
import { userReactionRepo } from "../user-reaction/user-reaction.repository";
import { storyRepo } from "../story/story.repository";


const schema = new Schema <IUser>({
    userName : {type : String , required : true},
    password : {type : String , required : function(){
        if(this.provider === SYS_PROVIDER.google) return false;

        return true
    }},
    phone : {type : String},  
    email : {type : String , required : true},
    profilePic : String,
    gender : { type : Number , enum : SYS_GENDER},
    role : { type : Number , enum : SYS_ROLE , default : SYS_ROLE.user},
    provider : { type : Number , enum : SYS_PROVIDER , default : SYS_PROVIDER.system},
    credentialsUpdatedAt  : {type : Date , default : Date.now()},
    lockUntil: Date,
    numberOfTries : {type:Number, default:0}


},{timestamps : true})

schema.pre("deleteOne", async function(){

    const filter = this.getFilter()

    const createdComments = await commentRepo.getAll({userId: filter._id})
    const createdPosts = await postRepo.getAll({userId: filter._id})
    
    const createdRequests = await requestRepo.getAll({userId: filter._id})
    const friends = await userFriendRepo.getAll({$or:[{user:filter._id},{friend:filter._id}]})
    const reactions = await userReactionRepo.getAll({userId: filter._id})
    const stories = await storyRepo.getAll({userId: filter._id})

    

       if(createdComments?.length > 0){
    
              for (const createdComment of createdComments) {
            await commentRepo.delete({_id:createdComment._id})
        }
    
        }

          if(createdPosts?.length > 0){
    
              for (const createdPost of createdPosts) {
            await postRepo.delete({_id:createdPost._id})
        }
    
        }

          if(createdRequests?.length > 0){
    
              for (const createdRequest of createdRequests) {
            await requestRepo.delete({_id:createdRequest._id})
        }
    
        }

        
          if(friends?.length > 0){
    
              for (const friend of friends) {
            await userFriendRepo.delete({_id:friend._id})
        }
    
        }

          if(reactions?.length > 0){
    
              for (const reaction of reactions) {
            await userReactionRepo.delete({_id:reaction._id})
        }
    
        }


         if(stories?.length > 0){
    
              for (const story of stories) {
            await storyRepo.delete({_id:story._id})
        }
    
        }
      
    

})

export const User = model<IUser>("User" , schema)