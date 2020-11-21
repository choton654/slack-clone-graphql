import { Link, Router } from "react-router-dom";
import NextLink from "next/link";
import React from "react";
import { Menu } from "semantic-ui-react";
const Layout = ({ children }) => {
  return (
    <div>
      <Menu style={{ marginBottom: 0 }}>
        <NextLink href="/register">
          <Menu.Item>Register</Menu.Item>
        </NextLink>
        <NextLink href="/login">
          <Menu.Item>Login</Menu.Item>
        </NextLink>
        <NextLink href="/about">
          <Menu.Item>About</Menu.Item>
        </NextLink>
        <NextLink href="/">
          <Menu.Item>Home</Menu.Item>
        </NextLink>

        {/* <Link to="/">
            <Menu.Item>Home</Menu.Item>
          </Link>
          <Link to="/view-team">
            <Menu.Item>View Team</Menu.Item>
          </Link>
          <Link to="/create-team">
            <Menu.Item>Create Team</Menu.Item>
          </Link>
          <Link to="/post">
            <Menu.Item>Post</Menu.Item>
          </Link>
          <Link to="/comment">
            <Menu.Item>Comment</Menu.Item>
          </Link> */}
      </Menu>
      {children}
    </div>
  );
};

export default Layout;
