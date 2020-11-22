import { ApolloProvider } from "@apollo/client";
import { client } from "../apollo/client";
import Layout from "../components/layout";

function MyApp({ Component, pageProps, props }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : (
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      )}
    </div>
  );
}

export default MyApp;
