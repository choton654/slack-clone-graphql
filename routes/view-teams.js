import { useApolloClient, useQuery } from "@apollo/client"
import { navigate } from "gatsby"
import findIndex from "lodash/findIndex"
import React from "react"
import AppLayout from "../components/AppLayout"
import Header from "../components/Header"
import SendMessage from "../components/SendMessage"
import MessageContainer from "../containers/MessageContainer"
import Sidebar from "../containers/Sidebar"
import { createMessageMutation } from "../graphql/mutation"
import { meQuery } from "../graphql/query"

function ViewTeams({ teamId, channelId }) {
  const { loading, error, data } = useQuery(meQuery, {
    fetchPolicy: "network-only",
  })
  const client = useApolloClient()
  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`
  if (error?.message === "Not authenticated") {
    navigate("/login")
  }

  if (!error && !data.me.teams.length) {
    navigate("/app/create-team")
  }

  const teamIdx = teamId ? findIndex(data.me.teams, ["id", teamId]) : 0
  const team = teamIdx === -1 ? data.me.teams[0] : data.me.teams[teamIdx]

  const channelIdx = channelId
    ? findIndex(team?.channels, ["id", channelId])
    : 0
  const channel =
    channelIdx === -1 ? team?.channels[0] : team?.channels[channelIdx]

  // console.log(team.directMessageMembers)

  return (
    <AppLayout>
      <Sidebar
        teams={data.me.teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        currentUserId={data.me.id}
        username={data.me.username}
      />
      {channel && <Header channelName={channel?.name || ""} />}
      {channel && <MessageContainer channelId={channel?.id} />}
      {channel && (
        <SendMessage
          channelId={channel?.id}
          placeholder={channel?.name || ""}
          msgSubmit={async text => {
            await client.mutate({
              variables: { text, channelId: channel.id },
              mutation: createMessageMutation,
            })
          }}
        />
      )}
    </AppLayout>
  )
}

export default ViewTeams
