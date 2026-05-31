import { Types } from "mongoose";
import { RequestRepo } from "../../DB/models/request/request.repository";
import { BadRequestException, ConflictException, NotFoundException, UnAuthorizedException } from "../../common";
import { UserFriendRepo } from "../../DB/models/user-friend/user-friend.repository";
import { UserRepository } from "../../DB/models/user/user.repository";


class RequestService {

    constructor(private readonly requestRepo:RequestRepo,private readonly userFriendRepo: UserFriendRepo,private readonly userRepo: UserRepository){}


    async create(senderId:Types.ObjectId,receiverId:Types.ObjectId){

        if(senderId.toString() == receiverId.toString()) throw new BadRequestException("senderId cant equals receiverId")

      const userFriendExist =  await this.userFriendRepo.getOne({$or:[{user:senderId,friend:receiverId},{user:receiverId,friend:senderId}]})

        if(userFriendExist) throw new BadRequestException("you already friends")
        // check receiver 
       const receiverExist =  await this.userRepo.getOne({_id:receiverId})
       if(!receiverExist) throw new NotFoundException("user not found")
        // check request
      const requestExist = await this.requestRepo.getOne({$or :[{sender:senderId,receiver:receiverId},{sender:receiverId,receiver:senderId}]})

      if(requestExist) throw new ConflictException("Request already sent")

        // create request
       return await this.requestRepo.create({sender:senderId,receiver:receiverId})

    }


    async getAll(userId:Types.ObjectId){
    return await this.requestRepo.getAll({$or :[{sender:userId},{receiver:userId}]})
    }

    async acceptRequest(userId:Types.ObjectId,id:Types.ObjectId){
        // check request
          const requestExist = await this.requestRepo.getOne({_id:id})
      if(!requestExist) throw new NotFoundException("No request found")

       // check only receiver accepts the request
      if(!requestExist.receiver.equals(userId)) throw new UnAuthorizedException("you can't accept this request")
        // delete request
      await this.requestRepo.delete({_id:id})

      //create user-friend
      await this.userFriendRepo.create({user:userId,friend:requestExist.sender})

        
    }


    async declineRequest(userId:Types.ObjectId,id:Types.ObjectId){
      // check request 

      const requestExist = await this.requestRepo.getOne({_id:id})
      if(!requestExist) throw new NotFoundException("request not found")

        if(!userId.equals(requestExist.receiver) && !userId.equals(requestExist.sender)) throw new UnAuthorizedException("you are not authorized to cancel request")

         return await this.requestRepo.delete({_id:id})

    }

    async removeFriend(userId:Types.ObjectId,friendId:Types.ObjectId){
       if(userId.toString() == friendId.toString()) throw new BadRequestException("senderId cant equals receiverId")
      // check userFriend
     const userFriendExist = await this.userFriendRepo.getOne({$or: [{user:userId,friend:friendId},{user:friendId,friend:userId}]})

     if(!userFriendExist) throw new NotFoundException("you are not friends")

      // remove friend
      return await this.userFriendRepo.delete({_id:userFriendExist._id})
    }
}


export default new RequestService(new RequestRepo(),new UserFriendRepo(),new UserRepository())