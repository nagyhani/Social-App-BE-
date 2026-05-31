import { Types } from "mongoose";
import { StoryRepository } from "../../DB/models/story/story.repository";
import { CreateStoryDTO } from './story.dto';
import { NotFoundException } from "../../common";
import { ICloudProvider, UploadResult } from "../../common/cloud/cloud.interface";
import { CloudinaryProvider } from "../../common/cloud/cloudinary/cloudinary.service";

class StoryService {

    constructor(private readonly storyRepo: StoryRepository, private readonly cloudProvider: ICloudProvider){}

    async create(createStoryDTO:CreateStoryDTO,userId:Types.ObjectId,file: Express.Multer.File){

        let attachmentFile: UploadResult | null = null

  if (file) {
     attachmentFile = await this.cloudProvider.uploadFile(file, userId)
  }

       return await this.storyRepo.create({...createStoryDTO,userId,attachment:{public_id:attachmentFile?.public_id as string,secure_url:attachmentFile?.secure_url as string}})

    }

    async get(id:string,userId:Types.ObjectId){
       
   const story = await this.storyRepo.getOne({_id: new Types.ObjectId(id),userId})

   if(!story) throw new NotFoundException("story not found")

    return story
    }

    async update(id:string,userId:Types.ObjectId,createStoryDTO:CreateStoryDTO,file: Express.Multer.File){

          let attachmentFile: UploadResult | null = null

  if (file) {
     attachmentFile = await this.cloudProvider.uploadFile(file, userId)
  }


         const story = await this.storyRepo.update({_id: new Types.ObjectId(id),userId},{...createStoryDTO,attachment:{public_id:attachmentFile?.public_id,secure_url:attachmentFile?.secure_url}})

       if(!story) throw new NotFoundException("story not found")

        return story

       
    }

    async delete(id:string,userId:Types.ObjectId){

        const story = await this.storyRepo.getOne({_id: new Types.ObjectId(id),userId})

         if(!story) throw new NotFoundException("story not found")

            if(story.attachment?.public_id) await this.cloudProvider.deleteFile(story.attachment?.public_id as string)

            await this.storyRepo.delete({_id: new Types.ObjectId(id),userId})
    }

   
}

export const storyService = new StoryService(new StoryRepository(), new CloudinaryProvider())