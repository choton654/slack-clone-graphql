import { gql } from "@apollo/client"

export const CREATE_CHANNEL = gql`
  mutation createChannel(
    $teamId: ID!
    $name: String!
    $public: Boolean
    $members: [ID!]
  ) {
    createChannel(
      teamId: $teamId
      name: $name
      public: $public
      members: $members
    ) {
      ok
      channel {
        id
        name
        dm
      }
    }
  }
`

export const CREATE_TEAM = gql`
  mutation createTeam($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      error {
        error
      }
    }
  }
`
export const USER_LOGIN = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      errors {
        error
      }
      token
      refreshToken
    }
  }
`

export const CREATE_USER = gql`
  mutation createUser($email: String!, $username: String!, $password: String!) {
    createUser(email: $email, username: $username, password: $password) {
      id
      username
      email
    }
  }
`
export const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: ID!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      error {
        error
      }
    }
  }
`

export const createMessageMutation = gql`
  mutation($channelId: ID!, $text: String, $file: Upload) {
    createMessage(channelId: $channelId, text: $text, file: $file)
  }
`

export const SingleUpload = gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      url
    }
  }
`
export const createDirectMessageMutation = gql`
  mutation($receiverId: ID!, $text: String!, $teamId: ID!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`
export const getOrCreateChannelMutation = gql`
  mutation($teamId: ID!, $members: [ID!]!) {
    getOrCreateChannel(teamId: $teamId, members: $members) {
      id
      name
    }
  }
`
