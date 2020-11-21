// import { Router } from "@reach/router";
import React from "react";
import Home from "../components/Home";
import Post from "../components/Post";
import Comment from "../components/Comment";
import CreateTeam from "../routes/create-team";
import DirectMessage from "../routes/direct-message";
import PrivateRoute from "../routes/protected-route";
import ViewTeams from "../routes/view-teams";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const App = () => {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/comment">Comment</Link>
          </li>
          <li>
            <Link to="/post">Post</Link>
          </li>
          <li>
            <Link to="/view-team">View Team</Link>
          </li>
          <li>
            <Link to="/create-team">Create Team</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/post" component={Post} />
          <Route exact path="/comment" component={Comment} />
          <PrivateRoute exact path="/create-team" component={CreateTeam} />
          <PrivateRoute exact="/view-team/" component={ViewTeams} />
          <PrivateRoute
            exact
            path="/view-team/:teamId/user/:userId"
            component={DirectMessage}
          />
          <PrivateRoute exact path="/view-team/:teamId" component={ViewTeams} />
          <PrivateRoute
            exact
            path="/view-team/:teamId/:channelId"
            component={ViewTeams}
          />
        </Switch>
      </div>
    </Router>
  );
};
export default App;
