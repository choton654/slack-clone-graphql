import { navigate } from "@reach/router";
import { useHistory } from "react-router-dom";
import decode from "jwt-decode";
import React from "react";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const history = useHistory();
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      decode(token);
      decode(refreshToken);
      // const currentTime = Date.now() / 1000
      // const decode = jwt_decode(token)
      // if (decode.exp < currentTime) {
      //   token = null
      // }
      return true;
    } catch (err) {
      window.location.hash = "app/login";
      return false;
    }
  };

  if (!isAuthenticated() && location.pathname !== `/login`) {
    history.pushState("/login");
    return null;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
