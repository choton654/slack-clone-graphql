import { useQuery } from "@apollo/client"
import React from "react"
import { Card, Grid } from "semantic-ui-react"
import { GET_USERS } from "../graphql/query"

const Home = () => {
  const { loading, error, data } = useQuery(GET_USERS)

  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`
  return (
    <Grid container columns={3}>
      {data.allUsers.map(user => (
        <Grid.Column key={user.id}>
          <Card color="olive" header={user.username} meta={user.email} />
        </Grid.Column>
      ))}
    </Grid>
  )
}

export default Home
