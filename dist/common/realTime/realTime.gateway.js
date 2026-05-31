"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealTimeGateway = void 0;
const socket_io_1 = require("socket.io");
const utils_1 = require("../utils");
const config_1 = require("../../config");
const DB_1 = require("../../DB");
class RealTimeGateway {
    _io;
    constructor(server) {
        this._io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    }
    establishConnection() {
        this._io.use((socket, next) => {
            try {
                socket.data = (0, utils_1.verifyToken)(socket.handshake.auth.token, config_1.ACCESS_TOKEN_SECRET);
                next();
            }
            catch (error) {
                next(error);
            }
        });
        this._io.on("connection", async (socket) => {
            await (0, DB_1.addToSet)(`socketIds:${socket.data.sub}`, socket.id);
            const socketIds = await (0, DB_1.getAllSet)(`socketIds:${socket.data.sub}`);
            console.log(socketIds);
            socket.on("disconnect", async () => {
                await (0, DB_1.rmSet)(`socketIds:${socket.data.sub}`, socket.id);
                console.log("disconnects", socket.id);
            });
        });
    }
    get io() {
        this.establishConnection();
        return this._io;
    }
}
exports.RealTimeGateway = RealTimeGateway;
