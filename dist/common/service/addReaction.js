"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReaction = void 0;
const utils_1 = require("../utils");
const user_reaction_repository_1 = require("../../DB/models/user-reaction/user-reaction.repository");
const enums_1 = require("../enums");
function toModel(collectionName) {
    switch (collectionName) {
        case "posts":
            return enums_1.ON_MODEL.Post;
        case "comments":
            return enums_1.ON_MODEL.Comment;
        default:
            throw new utils_1.BadRequestException("invalid collection");
    }
}
const addReaction = async (addReactionDTO, userId, repo) => {
    // check post exist
    const docExist = await repo.getOne({ _id: addReactionDTO.id });
    if (!docExist)
        throw new utils_1.NotFoundException("not found");
    //check user reactions
    const userReactionRepo = new user_reaction_repository_1.UserReactionRepository();
    const collectionName = docExist?.collection.name;
    const userReaction = await userReactionRepo.getOne({ onModel: toModel(collectionName), refId: addReactionDTO.id, userId });
    // if no reaction
    if (!userReaction) {
        await userReactionRepo.create({ onModel: toModel(collectionName), refId: addReactionDTO.id, userId, reaction: addReactionDTO.reaction });
        await repo.update({ _id: addReactionDTO.id }, { $inc: { reactionCount: 1 } });
        return;
    }
    // same reaction
    if (userReaction.reaction == addReactionDTO.reaction) {
        await repo.update({ _id: addReactionDTO.id }, { $inc: { reactionCount: -1 } });
        await userReactionRepo.delete({ _id: userReaction._id });
        return;
    }
    // different reaction
    await userReactionRepo.update({ _id: userReaction._id }, { reaction: addReactionDTO.reaction });
};
exports.addReaction = addReaction;
