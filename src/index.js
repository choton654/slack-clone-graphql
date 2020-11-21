const express = require("express");
const nextJS = require("next");
const { ApolloServer, PubSub } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const http = require("http");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { auth, refreshtokens, SECRET } = require("./middleware/authMiddleware");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");
const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3000;
const nestApp = nextJS({ dev });
const handle = nestApp.getRequestHandler();

async function start() {
  await nestApp.prepare();

  require("dotenv").config();
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("err", (err) => console.log(err));
  db.once("open", () => console.log("we are connected"));

  const app = express();
  app.use(cookieParser());

  app.use(auth);

  app.disable("x-powered-by");

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => ({ req, res }),
    subscriptions: {
      onConnect: async ({ token, refreshToken }, webSocket) => {
        if (token && refreshToken) {
          let user;
          try {
            const payload = jwt.verify(token, SECRET);
            return { user: payload.user };
          } catch (error) {
            const newTokens = await refreshtokens(token, refreshToken);
            console.log(newTokens);
            return { user: newTokens.user };
          }
        }
        throw new Error("Missing auth tokens");
      },
    },
  });
  server.applyMiddleware({ app });
  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  app.all("*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
  });
}

start();
