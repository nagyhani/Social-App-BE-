import { Types } from "mongoose";
import { UserRepository } from "../../DB/models/user/user.repository";
import { encrypt, NotFoundException } from "../../common";
import { UpdateUserDTO } from "./user.dto";
import { setIntoCache } from "../../DB";
import { JwtPayload } from "jsonwebtoken";
import { UserFriendRepo } from './../../DB/models/user-friend/user-friend.repository';
import { PostRepository } from "../../DB/models/post/post.repository";
import { StoryRepository } from "../../DB/models/story/story.repository";


class UserService {

    constructor(private readonly userRepo: UserRepository,private readonly userFriendRepo: UserFriendRepo,private readonly postRepo: PostRepository, private readonly storyRepo: StoryRepository){}

    async get(userId:Types.ObjectId){

      const user = await this.userRepo.getOne({_id:new Types.ObjectId(userId)})

      if(!user) throw new NotFoundException("user not found")

        const friends = await this.userFriendRepo.getAll({$or:[{user:userId},{friend:userId}]},{},{populate:[{path:"user"},{path:"friend"}]})

        return {friends,user}
    }

    async feed(userId:Types.ObjectId){

     const friends =  await this.userFriendRepo.getAll({user: userId})

     const friendIds = friends.map(friend => friend.friend);

  const posts = await this.postRepo.getAll({
    userId: { $in: [...friendIds, userId] }
  });
  return posts
    }

    async dashboard(userId: Types.ObjectId) {
  const friends = await this.userFriendRepo.getAll({ user: userId });

  const friendIds = friends.map(f => f.friend);

  const posts = await this.postRepo.getAll({
    userId: { $in: [...friendIds, userId] }
  }, {
    sort: { createdAt: -1 },
    limit: 20
  });

  const stories = await this.storyRepo.getAll({
    userId: { $in: [...friendIds, userId] }
  });

  return {
    posts,
    stories
  };
}

    async update(updateUserDTO: UpdateUserDTO,userId:Types.ObjectId,tokenPayload:JwtPayload){

      const user = await this.userRepo.getOne({_id:userId})

          if(!user) throw new NotFoundException("user not found")

            
     if(updateUserDTO.email){
     
        await setIntoCache(`${updateUserDTO.email}:blockedToken` , tokenPayload.jti as string,(tokenPayload.exp as number) * 1000  )
     }

     if(updateUserDTO.phone) updateUserDTO.phone = encrypt(updateUserDTO.phone)

      const updatedUser = await this.userRepo.update({_id:userId},updateUserDTO)

        return updatedUser
    }


    async delete(userId:Types.ObjectId){
       const userExist = await this.userRepo.getOne({_id: userId})

      if(!userExist) throw new NotFoundException("user not found")

        await this.userRepo.delete({_id: userId})
    }
}

export default new UserService( new UserRepository(),new UserFriendRepo(),new PostRepository(),new StoryRepository())