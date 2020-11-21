import React from "react"
import { ApolloProvider } from "@apollo/client"
import { client } from "./client"
import Layout from "../components/layout"

export const wrapRootElement = ({ element, props }) => (
  <Layout {...props}>
    <ApolloProvider client={client}>{element}</ApolloProvider>
  </Layout>
)
