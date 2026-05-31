"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGQLType = void 0;
const graphql_1 = require("graphql");
exports.UserGQLType = new graphql_1.GraphQLObjectType({
    name: "UserType",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        userName: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        profilePic: { type: graphql_1.GraphQLString },
        gender: { type: graphql_1.GraphQLInt },
        role: { type: graphql_1.GraphQLInt },
    }
});
