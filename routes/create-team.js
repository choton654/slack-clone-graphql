import { useMutation } from "@apollo/client";
import router from "next/router";
import React, { useState } from "react";
import { Button, Container, Form, Message } from "semantic-ui-react";
import { CREATE_TEAM } from "../graphql/mutation";
import { allTeamsQuery, meQuery } from "../graphql/query";

const CreateTeam = () => {
  const [team, setTeam] = useState("");
  const [error, setError] = useState({
    ok: false,
    error: "",
  });
  const [createTeam] = useMutation(CREATE_TEAM, {
    refetchQueries: [
      {
        query: meQuery,
      },
    ],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTeam({
      variables: { name: team },
    })
      .then((res) => {
        if (!res.data.createTeam.ok) {
          setError({
            ok: true,
            error: res.data.createTeam.error.error,
          });
        } else {
          setTeam("");
          router.push(`/view-team/${res.data.createTeam.team.id}`);
        }
      })
      .catch((err) => {
        console.error(err);
        setError({
          ok: true,
          error: err.message,
        });
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} error={error.ok}>
        <Form.Field>
          <label>Create Team</label>
          <input
            type="text"
            required
            name="team"
            onChange={(e) => {
              setTeam(e.target.value);
              setError({
                ok: false,
                error: "",
              });
            }}
            value={team}
            placeholder="Enter Team Name"
          />
        </Form.Field>
        {error.ok && (
          <Message
            error={error.ok}
            header="Action Forbidden"
            content={error.error}
          />
        )}
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default CreateTeam;
