"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorGlobalHandler = exports.BadRequestException = exports.UnAuthorizedException = exports.NotFoundException = exports.ConflictException = void 0;
class ConflictException extends Error {
    constructor(message) {
        super(message, { cause: 409 });
    }
}
exports.ConflictException = ConflictException;
class NotFoundException extends Error {
    constructor(message) {
        super(message, { cause: 404 });
    }
}
exports.NotFoundException = NotFoundException;
class UnAuthorizedException extends Error {
    constructor(message) {
        super(message, { cause: 401 });
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class BadRequestException extends Error {
    details;
    constructor(message, details) {
        super(message, { cause: 400 });
        this.details = details;
    }
}
exports.BadRequestException = BadRequestException;
const errorGlobalHandler = (error, req, res, next) => {
    const status = error.cause || 500;
    return res.status(status).json({
        error: error,
        message: error.message,
        stack: error.stack
    });
};
exports.errorGlobalHandler = errorGlobalHandler;
