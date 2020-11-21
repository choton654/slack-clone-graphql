const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {
    message(id: ID!): Message
    messages(offset: Int!, channelId: ID!): [Message!]!
    uploads: [File]
  }
  extend type Mutation {
    createMessage(channelId: ID!, text: String, file: Upload): Boolean!
    singleUpload(file: Upload!): File!
  }
  extend type Subscription {
    newMessage(channelId: ID!): Message!
  }

  type File {
    url: String!
  }
  type Message {
    id: ID!
    text: String!
    user: User!
    channel: Channel!
    createdAt: String!
  }
`;

module.exports = typeDefs;
