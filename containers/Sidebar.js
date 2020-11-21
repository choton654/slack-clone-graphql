import decode from "jwt-decode"
import React, { useState } from "react"
import AddChannelModal from "../components/AddChannelModal"
import Channels from "../components/Channels"
import DirectMessageModal from "../components/DirectMessageModal"
import InvitePeopleModal from "../components/InvitePeopleModal"
import Teams from "../components/Teams"

function Sidebar({ teams, team, username, currentUserId }) {
  const [openModal, setopenModal] = useState(false)
  const [openInvitePeopleModal, setopenInvitePeopleModal] = useState(false)
  const [openDirectMessageModal, setopenDirectMessageModal] = useState(false)

  const toggleChannelModal = e => {
    setopenModal(() => !openModal)
  }
  const toggleInvitePeopleModal = e => {
    setopenInvitePeopleModal(() => !openInvitePeopleModal)
  }
  const toggleDirectMessageModal = e => {
    setopenDirectMessageModal(() => !openDirectMessageModal)
  }

  let isOwner = false
  try {
    const token = localStorage.getItem("token")
    const { user } = decode(token)

    isOwner = user._id.toString() === team.owner.toString()
  } catch (err) {}

  const regularChannels = []
  const dmChannels = []

  if (team) {
    team.channels.forEach(c => {
      if (c.dm) {
        dmChannels.push(c)
      } else {
        regularChannels.push(c)
      }
    })
  }

  return [
    <Teams key="team-sidebar" teams={teams} />,
    <Channels
      key="channels-sidebar"
      teamName={team?.name}
      username={username}
      teamId={team?.id}
      isOwner={isOwner}
      // channels={team?.channels}
      channels={regularChannels}
      dmChannels={dmChannels}
      openChannelModal={toggleChannelModal}
      oninvitePeopleClick={toggleInvitePeopleModal}
      onDirectMessageClick={toggleDirectMessageModal}
      users={team?.directMessageMembers}
    />,
    <DirectMessageModal
      currentUserId={currentUserId}
      teamId={team?.id}
      onClose={toggleDirectMessageModal}
      open={openDirectMessageModal}
      key="sidebar-direct-message-modal"
    />,
    <AddChannelModal
      key="model-sidebar"
      teamId={team?.id}
      open={openModal}
      currentUserId={currentUserId}
      onClose={toggleChannelModal}
    />,
    <InvitePeopleModal
      key="invite-people"
      teamId={team?.id}
      open={openInvitePeopleModal}
      onClose={toggleInvitePeopleModal}
    />,
  ]
}

export default Sidebar
