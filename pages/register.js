import { useMutation } from "@apollo/client";
import router from "next/router";
import React, { useState } from "react";
import { Button, Container, Form, Message } from "semantic-ui-react";
import Layout from "../components/layout";
import { CREATE_USER } from "../graphql/mutation";
import { GET_USERS } from "../graphql/query";

const isServer = typeof window !== undefined;

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [success, setSuccess] = useState({
    success: false,
    message: "User has successfully registered",
  });
  const [createUser, { data }] = useMutation(CREATE_USER, {
    refetchQueries: [
      {
        query: GET_USERS,
      },
    ],
  });
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      error: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    createUser({
      variables: {
        username: user.username,
        email: user.email,
        password: user.password,
      },
    })
      .then((data) => {
        console.log(data);
        setSuccess({
          ...success,
          success: true,
        });
        setError({
          ...error,
          error: false,
        });
        // router.push("/");
        if (isServer) {
          window.location.assign("/login");
        }
      })
      .catch((err) => {
        console.error(err.message);
        setError({
          ...error,
          error: true,
          message: err.message,
        });
      });
    setUser({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <Layout>
      <Container>
        <Form
          onSubmit={handleSubmit}
          error={error.error}
          success={success.success}
        >
          <Form.Field>
            <label>User Name</label>
            <input
              type="text"
              required
              name="username"
              onChange={handleChange}
              value={user.username}
              placeholder="User Name"
            />
          </Form.Field>
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
          {success.success && (
            <Message
              success={success.success}
              header="Form Completed"
              content={success.message}
            />
          )}
          <Button type="submit">Submit</Button>
        </Form>
      </Container>
    </Layout>
  );
};

export default Register;
