const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {
    directMessages(teamId: ID!, receiverId: ID!): [DirectMessage!]!
  }
  extend type Mutation {
    createDirectMessage(receiverId: ID!, text: String!, teamId: ID!): Boolean!
  }
  extend type Subscription {
    newDirectMessage(teamId: ID!, userId: ID!): DirectMessage!
  }
  type DirectMessage {
    id: ID!
    text: String!
    sender: User!
    receiverId: ID!
    createdAt: String!
  }
`;

module.exports = typeDefs;
