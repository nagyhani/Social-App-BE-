import { model, Schema } from "mongoose";
import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE , IUser } from "../../../common";

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
    credentialsUpdatedAt  : {type : Date , default : Date.now()}


},{timestamps : true})

export const User = model<IUser>("User" , schema)