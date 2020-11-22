import { Link } from "react-router-dom";
import React from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import decode from "jwt-decode";

const ChannelWrapper = styled.div`
  grid-column: 2;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = "padding-left: 10px";

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;
const SideBarListHeader = styled.li`
  ${paddingLeft};
`;

const PushLeft = styled.div`
  ${paddingLeft};
`;

const Green = styled.span`
  color: #38978d;
`;
const Bubble = ({ on = true }) => (on ? <Green>●</Green> : "○");

function Channels({
  teamName,
  username,
  channels,
  users,
  dmChannels,
  openChannelModal,
  teamId,
  oninvitePeopleClick,
  isOwner,
  onDirectMessageClick,
}) {
  const dmChannel = ({ id, name }, teamId) => (
    <SideBarListItem key={`user-${id}`}>
      <Link to={`/view-team/${teamId}/${id}`}>
        <Bubble /> {name}
      </Link>
    </SideBarListItem>
  );

  return (
    <ChannelWrapper>
      <PushLeft>
        <TeamNameHeader>{teamName}</TeamNameHeader>
        {username}
      </PushLeft>
      <div>
        <SideBarList>
          <SideBarListHeader>
            Channels{" "}
            {isOwner && (
              <i className="plus circle icon" onClick={openChannelModal} />
            )}
          </SideBarListHeader>
          {channels?.map(({ id, name }) => (
            <Link key={`channel-${id}`} to={`/view-team/${teamId}/${id}`}>
              <SideBarListItem>#{name}</SideBarListItem>
            </Link>
          ))}
        </SideBarList>
      </div>
      <div>
        <SideBarList>
          <SideBarListHeader>
            Direct Messages{" "}
            <Icon onClick={onDirectMessageClick} name="add circle" />
          </SideBarListHeader>

          {dmChannels.map((dmC) => dmChannel(dmC, teamId))}
        </SideBarList>
      </div>
      {isOwner && (
        <div>
          <a href="#invite-people" onClick={oninvitePeopleClick}>
            + Invite People
          </a>
        </div>
      )}
    </ChannelWrapper>
  );
}

export default Channels;

{
  /* {users?.map(({ id, username }) => {
            return (
              <SideBarListItem key={`user-${id}`}>
                <Bubble />
                <Link to={`/app/view-team/${teamId}/user/${id}`}>
                  {username}
                </Link>
              </SideBarListItem>
            )
          })} */
}
