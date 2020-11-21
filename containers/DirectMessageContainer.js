import { useQuery } from "@apollo/client"
import React, { useEffect } from "react"
import { Comment } from "semantic-ui-react"
import Messages from "../components/Messages"
import {
  directMessagesQuery,
  newDirectMessageSubscription,
} from "../graphql/query"

function DirectMessageContainer({ teamId, userId }) {
  const { loading, error, data, subscribeToMore } = useQuery(
    directMessagesQuery,
    {
      variables: { teamId, userId },
      fetchPolicy: "network-only",
    }
  )

  const suscribe = (teamId, userId) =>
    subscribeToMore({
      document: newDirectMessageSubscription,
      variables: { teamId, userId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log("prev", prev, subscriptionData)
        if (!subscriptionData.data) return prev
        return {
          ...prev,
          directMessages: [
            ...prev.directMessages,
            subscriptionData.data.newDirectMessage,
          ],
        }
      },
      onError: err => console.error(err.message),
    })

  let unSuscribe
  useEffect(() => {
    if (teamId && userId) {
      unSuscribe = suscribe(teamId, userId)
    }
    return () => {
      unSuscribe()
    }
  }, [teamId, userId])

  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`
  return (
    <>
      <Messages>
        <Comment.Group>
          {data.directMessages.map(m => (
            <Comment key={m.id}>
              <Comment.Content>
                <Comment.Author as="a">{m.sender.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.createdAt}</div>
                </Comment.Metadata>
                <Comment.Text>{m.text}</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    </>
  )
}

export default DirectMessageContainer
