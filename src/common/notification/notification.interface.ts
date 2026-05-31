
export interface INotificationProvider {

    send(token:string,data: {title:string,body:string}): Promise<void>
    
      sendAll(tokens:string[],data: {title:string,body:string}): Promise<void>
}