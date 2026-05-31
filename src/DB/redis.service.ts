import { redisClient } from "./redis.connect";

export async function setIntoCache(key:string,value:number|string,expire:number){

    redisClient.set(key,value,{EX:expire})
}

export async function getFromCache(key:string){

   return redisClient.get(key)
}

export async function deleteFromCache(key:string){

   return redisClient.del(key)
}


export async function addToSet(key:string,value:string){

   return await redisClient.sAdd(key,value)
}

export async function rmSet(key:string,value:string){

   const number = await redisClient.sRem(key,value)

   return !!number
}

export async function getAllSet(key:string){
   return await redisClient.sMembers(key)
}


