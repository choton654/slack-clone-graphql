import NextLink from "next/link";
import React from "react";
import { Menu } from "semantic-ui-react";
const Layout = ({ children }) => {
  return (
    <div>
      <Menu style={{ marginBottom: 0 }}>
        <NextLink href="/">
          <Menu.Item>Home</Menu.Item>
        </NextLink>
        <NextLink href="/register">
          <Menu.Item>Register</Menu.Item>
        </NextLink>
        <NextLink href="/login">
          <Menu.Item>Login</Menu.Item>
        </NextLink>
      </Menu>
      {children}
    </div>
  );
};

export default Layout;
