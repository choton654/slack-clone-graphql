import NextLink from "next/link";
import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import Home from "../components/Home";
import CreateTeam from "../routes/create-team";
import DirectMessage from "../routes/direct-message";
import PrivateRoute from "../routes/protected-route";
import ViewTeams from "../routes/view-teams";
const App = () => {
  return (
    <Router>
      <Menu style={{ marginBottom: 0, marginTop: 0 }}>
        <Link to="/">
          <Menu.Item>Home</Menu.Item>
        </Link>
        <Link to="/view-team">
          <Menu.Item>View Team</Menu.Item>
        </Link>
        <Link to="/create-team">
          <Menu.Item>Create Team</Menu.Item>
        </Link>
        <NextLink href="/register">
          <Menu.Item>Register</Menu.Item>
        </NextLink>
        <NextLink href="/login">
          <Menu.Item>Login</Menu.Item>
        </NextLink>
      </Menu>
      <Switch>
        <Route exact path="/" component={Home} />
        <PrivateRoute path="/create-team" component={CreateTeam} />
        <PrivateRoute path="/view-team/" exact component={ViewTeams} />
        <PrivateRoute
          path="/view-team/:teamId/user/:userId"
          exact
          component={DirectMessage}
        />
        <PrivateRoute path="/view-team/:teamId" exact component={ViewTeams} />
        <PrivateRoute
          path="/view-team/:teamId/:channelId"
          exact
          component={ViewTeams}
        />
      </Switch>
    </Router>
  );
};
export default App;

{
  /* <PrivateRoute
            path="/view-team/:teamId?/:channelId?"
            exact
            component={ViewTeams}
          />
          <PrivateRoute path="/create-team" exact component={CreateTeam} /> */
}
