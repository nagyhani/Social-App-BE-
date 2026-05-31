import { IStory } from "../../../common/interFaces/story.interface";
import { AbstractRepository } from "../../abstract.repository";
import { Story } from "./story.model";

export class StoryRepository extends AbstractRepository<IStory>{
    constructor(){
        super(Story)
    }
}

export const storyRepo = new StoryRepository()