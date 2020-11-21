const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    me: User!
    allUsers: [User!]!
    getUser(userId: ID!): User
  }
  extend type Mutation {
    createUser(email: String!, username: String!, password: String!): User!
    loginUser(email: String!, password: String!): Token
  }

  extend type Subscription {
    newUser: User!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    teams: [Team!]!
  }
  type Token {
    errors: [Error!]
    token: String
    refreshToken: String
  }
  type Error {
    error: String!
  }
`;
