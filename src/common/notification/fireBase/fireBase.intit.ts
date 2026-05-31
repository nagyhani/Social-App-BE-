import path from "node:path";
import { FireBaseNotificationProvider } from "./fireBase.service";
import * as fs from "node:fs"


const config = JSON.parse(fs.readFileSync(path.resolve("./src/config/social-app-5a908-firebase-adminsdk-fbsvc-491f8968be.json"))as unknown as string)

export const fireBaseNotificationProvider = new FireBaseNotificationProvider(config)