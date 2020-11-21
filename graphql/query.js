import { gql } from "@apollo/client"

export const allTeamsQuery = gql`
  query {
    allTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
    inviteTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
  }
`
export const meQuery = gql`
  {
    me {
      id
      username
      teams {
        id
        name
        owner
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
          dm
        }
      }
    }
  }
`

export const directMessageMeQuery = gql`
  query($userId: ID!) {
    getUser(userId: $userId) {
      username
    }
    me {
      id
      username
      teams {
        id
        name
        owner
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
          dm
        }
      }
    }
  }
`

export const GET_USERS = gql`
  query {
    allUsers {
      id
      username
      email
    }
  }
`
export const messagesQuery = gql`
  query($offset: Int!, $channelId: ID!) {
    messages(channelId: $channelId, offset: $offset) {
      id
      text
      createdAt
      user {
        username
      }
    }
  }
`
export const newChannelMessageSubscription = gql`
  subscription($channelId: ID!) {
    newMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`

export const newDirectMessageSubscription = gql`
  subscription($teamId: ID!, $userId: ID!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`

export const directMessagesQuery = gql`
  query($teamId: ID!, $userId: ID!) {
    directMessages(teamId: $teamId, receiverId: $userId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`
export const getTeamMembersQuery = gql`
  query($teamId: ID!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`
