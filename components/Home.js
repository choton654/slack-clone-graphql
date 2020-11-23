import { useQuery } from "@apollo/client";
import React from "react";
import { Card, Grid, Header, List, Container } from "semantic-ui-react";
import { GET_USERS } from "../graphql/query";

const Home = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <Container
      text
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Header as="h2" style={{ marginTop: "20px" }}>
        List of Users
      </Header>
      <List style={{ textAlign: "center" }}>
        {data.allUsers.map((user) => (
          <List.Content style={{ marginTop: "20px" }}>
            <List.Header as="h3" style={{ margin: 0 }}>
              {user.username}
            </List.Header>
            <List.Description as="p">{user.email}</List.Description>
          </List.Content>
        ))}
      </List>
    </Container>
  );
};

export default Home;
{
  /* <Grid container columns={3}>
      <Header as="h2">List of Users</Header>
      {data.allUsers.map((user) => (
        <Grid.Column key={user.id}>
          <Card color="olive" header={user.username} meta={user.email} />
        </Grid.Column>
      ))}
    </Grid> */
}
