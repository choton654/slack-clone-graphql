import { useQuery } from "@apollo/client"
import React, { useEffect, useRef, useState } from "react"
import { Button, Comment } from "semantic-ui-react"
import FileUpload from "../components/FileUploads"
import Messages from "../components/Messages"
import { messagesQuery, newChannelMessageSubscription } from "../graphql/query"

function MessageContainer({ channelId }) {
  const { loading, error, data, subscribeToMore, fetchMore } = useQuery(
    messagesQuery,
    {
      onError: err => console.error(err),
      variables: { channelId, offset: 0 },
      fetchPolicy: "network-only",
    }
  )
  const [hasMoreItems, sethasMoreItems] = useState(true)

  const scrollref = useRef(null)

  const handleScroll = () => {
    if (
      scrollref.current &&
      scrollref.current.scrollTop < 100 &&
      hasMoreItems &&
      data.messages.length >= 10
    ) {
      fetchMore({
        variables: { channelId, offset: data.messages.length },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult
          if (fetchMoreResult.messages.length < 10) {
            // this.setState({ hasMoreItems: false });
            sethasMoreItems(false)
          }
          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages],
          }
        },
      })
    }
  }

  const suscribe = channelId =>
    subscribeToMore({
      document: newChannelMessageSubscription,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        console.log(prev, subscriptionData)
        if (!subscriptionData.data) return prev
        return {
          ...prev,
          messages: [subscriptionData.data.newMessage, ...prev.messages],
        }
      },
      onError: err => console.error(err.message),
    })

  let unSuscribe
  useEffect(() => {
    if (channelId) {
      unSuscribe = suscribe(channelId)
    }

    if (
      scrollref.current &&
      scrollref.current.scrollTop < 20 &&
      data.messages
    ) {
      // 35 items
      const heightBeforeRender = scrollref.current.scrollHeight
      // wait for 70 items to render
      setTimeout(() => {
        scrollref.current.scrollTop =
          scrollref.current.scrollHeight - heightBeforeRender
      }, 120)
    }

    return () => {
      unSuscribe()
    }
  }, [channelId])

  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`
  return (
    <>
      <Messages ref={scrollref} onScroll={handleScroll}>
        <Comment.Group>
          {data.messages
            .slice()
            .reverse()
            .map(m => (
              <Comment key={m.id}>
                <Comment.Content>
                  <Comment.Author as="a">{m.user.username}</Comment.Author>
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

export default MessageContainer

{
  /* {hasMoreItems && (
            <Button
              onClick={() => {
                fetchMore({
                  variables: { channelId, offset: data.messages.length },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return previousResult
                    if (fetchMoreResult.messages.length < 10) {
                      // this.setState({ hasMoreItems: false });
                      sethasMoreItems(false)
                    }
                    return {
                      ...previousResult,
                      messages: [
                        ...previousResult.messages,
                        ...fetchMoreResult.messages,
                      ],
                    }
                  },
                })
              }}
            >
              Load More
            </Button>
          )} */
}
