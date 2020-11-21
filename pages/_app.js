import { ApolloProvider } from "@apollo/client";
import { client } from "../apollo/client";
import Layout from "../components/layout";

function MyApp({ Component, pageProps, props }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : (
        <Layout {...pageProps}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Layout>
      )}
    </div>
  );
}

export default MyApp;
