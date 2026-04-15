import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../enums";

export interface IUser {
    userName : string,
    email: string,
    profilePic? : string,
    phone? : string,
    password:string,
    role : SYS_ROLE,
    gender : SYS_GENDER,
    provider : SYS_PROVIDER,
    credentialsUpdatedAt  : Date
}
