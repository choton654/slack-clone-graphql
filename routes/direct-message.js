import { useApolloClient, useQuery } from "@apollo/client";
import findIndex from "lodash/findIndex";
import React from "react";
import AppLayout from "../components/AppLayout";
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import DirectMessageContainer from "../containers/DirectMessageContainer";
import Sidebar from "../containers/Sidebar";
import { createDirectMessageMutation } from "../graphql/mutation";
import { directMessageMeQuery, meQuery } from "../graphql/query";

function DirectMessage(props) {
  const { teamId, userId } = props.computedMatch.params;

  const { loading, error, data } = useQuery(directMessageMeQuery, {
    variables: { userId },
    fetchPolicy: "network-only",
  });

  const client = useApolloClient();

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const teamIdx = teamId ? findIndex(data.me.teams, ["id", teamId]) : 0;
  const team = teamIdx === -1 ? data.me.teams[0] : data.me.teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={data.me.teams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
        username={data.me.username}
      />
      <Header channelName={data.getUser.username} />
      <DirectMessageContainer teamId={teamId} userId={userId} />
      <SendMessage
        msgSubmit={async (text) => {
          const res = await client.mutate({
            mutation: createDirectMessageMutation,
            variables: { text, receiverId: userId, teamId },
            optimisticResponse: {},
            update: (store) => {
              const data1 = store.readQuery({ query: meQuery });
              console.log("data1", data1);
              const teamIdx2 = findIndex(data1.me.teams, ["id", team.id]);
              const notAlreadyThere = data1.me.teams[
                teamIdx2
              ].directMessageMembers.every((member) => member.id !== userId);
              if (notAlreadyThere) {
                data1.me.teams[teamIdx2].directMessageMembers.push({
                  __typename: "User",
                  id: userId,
                  username: data.getUser.username,
                });
              }
              store.writeQuery({ query: meQuery, data: data1 });
            },
          });
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
}

export default DirectMessage;
