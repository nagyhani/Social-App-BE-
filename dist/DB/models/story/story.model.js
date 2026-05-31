"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
const mongoose_1 = require("mongoose");
const user_reaction_repository_1 = require("../user-reaction/user-reaction.repository");
const schema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    content: String,
    attachment: { secure_url: String, public_id: String },
    reactionCount: Number,
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
}, { timestamps: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
schema.pre("deleteOne", async function () {
    const filter = this.getFilter();
    const reactions = await user_reaction_repository_1.userReactionRepo.getAll({ refId: filter._id });
    if (reactions.length > 0) {
        for (const reaction of reactions) {
            await user_reaction_repository_1.userReactionRepo.delete({ _id: reaction._id });
        }
    }
});
exports.Story = (0, mongoose_1.model)("Story", schema);
