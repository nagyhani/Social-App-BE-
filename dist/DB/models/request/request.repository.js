"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRepo = exports.RequestRepo = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const request_model_1 = require("./request.model");
class RequestRepo extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(request_model_1.Request);
    }
}
exports.RequestRepo = RequestRepo;
exports.requestRepo = new RequestRepo();
