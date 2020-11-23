import decode from "jwt-decode";
import router from "next/router";
import React from "react";
import { useHistory } from "react-router-dom";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const history = useHistory();
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      decode(token);
      // decode(refreshToken);
      // const currentTime = Date.now() / 1000
      // const decode = jwt_decode(token)
      // if (decode.exp < currentTime) {
      //   token = null
      // }
      const { exp } = decode(refreshToken);
      if (Date.now() / 1000 > exp) {
        return false;
      }
    } catch (err) {
      window.location.hash = "/login";
      return false;
    }
    return true;
  };

  if (!isAuthenticated() && location.pathname !== `/login`) {
    // history.push("/login");
    router.push("/login");
    return null;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
