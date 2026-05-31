import { Types } from "mongoose";
import { chatRepo, ChatRepository } from "../../DB/models/chat/chat.repository";
import { NotFoundException } from "../../common";
import { messageRepo, MessageRepository } from "../../DB/models/message/message.repository";

class ChatService {

    constructor(private readonly chatRepo: ChatRepository,private readonly messageRepo: MessageRepository){}


   public async getChat(userId:Types.ObjectId,loginUser:Types.ObjectId){

   const chat = await this.chatRepo.getOne({participants:{$all:[userId,loginUser]}})

   if(!chat) throw new NotFoundException("No chat found")

    const messages = await this.getMessages(chat._id,userId,loginUser)

    return {chat,messages}

   }

   private async getMessages(chatId:Types.ObjectId,userId:Types.ObjectId,loginUser:Types.ObjectId){

    return await this.messageRepo.getAll({chat:chatId,$or:[{sender:userId},{sender:loginUser}]},{},{limit:10,sort:{createdAt:-1}})
   }
}

export default new ChatService(chatRepo,messageRepo)