import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import * as ws from "ws";
import fetch from "cross-fetch";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { onError } from "@apollo/client/link/error";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import "semantic-ui-css/semantic.min.css";

let token, refreshToken;

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
  // "https://sheltered-river-81197.herokuapp.com/graphql",
  fetch,
});

if (typeof window !== `undefined`) {
  token = localStorage.getItem("token");
  refreshToken = localStorage.getItem("refreshToken");
}

const middlewareLink = setContext(() => ({
  headers: {
    "x-token": token,
    "x-refresh-token": refreshToken,
  },
}));

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const {
      response: { headers },
    } = operation.getContext();
    if (headers) {
      const token = headers.get("x-token");
      const refreshToken = headers.get("x-refresh-token");

      if (token) {
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }

    return response;
  })
);

const httpLinkWithMiddleware = afterwareLink.concat(
  middlewareLink.concat(httpLink)
);

const wsLink = process.browser
  ? new WebSocketLink({
      uri: `wss://sheltered-river-81197.herokuapp.com/graphql`,
      options: {
        reconnect: true,
        lazy: true,
        connectionParams: {
          token: token,
          refreshToken: refreshToken,
        },
      },
    })
  : null;

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const splitLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLinkWithMiddleware,
      errorLink
    )
  : httpLinkWithMiddleware;

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
