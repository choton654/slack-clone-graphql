import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { Popup, Button } from "semantic-ui-react";
const TeamWrapper = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362234;
  color: #958993;
`;

const TeamList = styled.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = styled.li`
  height: 50px;
  width: 50px;
  background-color: #676066;
  color: #fff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 11px;
  &:hover {
    border-style: solid;
    border-width: thick;
    border-color: #767676;
  }
`;

const isServer = typeof window !== undefined;

function Teams({ teams }) {
  return (
    <TeamWrapper>
      <TeamList>
        {teams.map(({ id, letter }) => (
          <Link to={`/view-team/${id}`} key={`team-${id}`}>
            <TeamListItem>{letter}</TeamListItem>
          </Link>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Popup
            content="logout"
            trigger={
              <Button
                icon="log out"
                onClick={() => {
                  if (isServer) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refreshToken");
                    window.location.assign("/");
                  }
                }}
              />
            }
            // name="log out"
            // size="big"
          />
        </div>
      </TeamList>
    </TeamWrapper>
  );
}

export default Teams;
