import { useApolloClient } from "@apollo/client";
import { navigate } from "@reach/router";
import React, { useState } from "react";
import { Button, Container, Form, Message } from "semantic-ui-react";
import { USER_LOGIN } from "../graphql/mutation";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const client = useApolloClient();
  const handleSubmit = (e) => {
    e.preventDefault();
    client
      .mutate({
        variables: { email: user.email, password: user.password },
        mutation: USER_LOGIN,
      })
      .then((data) => {
        if (data.data.loginUser?.errors !== null) {
          const { errors } = data.data.loginUser;
          setError({
            ...error,
            error: true,
            message: errors[0].error,
          });
        } else {
          localStorage.setItem("token", data.data.loginUser.token);
          localStorage.setItem(
            "refreshToken",
            data.data.loginUser.refreshToken
          );
          // wsLink.subscriptionClient.tryConnect()
          navigate("/app");
          setUser({
            email: "",
            password: "",
          });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container>
      <Form onSubmit={handleSubmit} error={error.error}>
        <Form.Field>
          <label>Email</label>
          <input
            type="email"
            required
            name="email"
            onChange={handleChange}
            value={user.email}
            placeholder="Email"
          />
        </Form.Field>

        <Form.Field>
          <label>Password</label>
          <input
            type="password"
            required
            name="password"
            onChange={handleChange}
            value={user.password}
            placeholder="Password"
          />
        </Form.Field>
        {error.error && (
          <Message
            error={error.error}
            header="Action Forbidden"
            content={error.message}
          />
        )}
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default Login;
