const { gql } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {
    channel(id: ID!): Channel
    channels: [Channel!]!
  }

  extend type Mutation {
    createChannel(
      teamId: ID!
      name: String!
      public: Boolean = false
      members: [ID!] = []
    ): ChannelResponse!
    getOrCreateChannel(teamId: ID!, members: [ID!]!): DMChannelResponse!
  }
  type DMChannelResponse {
    id: ID!
    name: String!
  }

  type ChannelResponse {
    ok: Boolean!
    error: Error
    channel: Channel
  }

  type Channel {
    id: ID!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
    dm: Boolean!
  }
`;

module.exports = typeDefs;
