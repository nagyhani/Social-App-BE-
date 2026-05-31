import { IMessage } from "../../../common";
import { AbstractRepository } from "../../abstract.repository";
import { Message } from "./message.model";

export class MessageRepository extends AbstractRepository<IMessage>{
    constructor(){
        super(Message)
    }
}

export const messageRepo = new MessageRepository()