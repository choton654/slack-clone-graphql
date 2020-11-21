import { useQuery } from "@apollo/client"
import React from "react"
import { Dropdown } from "semantic-ui-react"
import { getTeamMembersQuery } from "../graphql/query"

function MultiSelectUsers({
  teamId,
  value,
  handleChange,
  placeholder,
  currentUserId,
}) {
  const { loading, error, data } = useQuery(getTeamMembersQuery, {
    variables: { teamId },
  })
  if (loading) return "Loading..."
  if (error) return `Error! ${error.message}`
  return (
    <Dropdown
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      fluid
      multiple
      search
      selection
      options={data.getTeamMembers
        .filter(tm => tm.id !== currentUserId)
        .map(tm => ({
          key: tm.id,
          value: tm.id,
          text: tm.username,
        }))}
    />
  )
}

export default MultiSelectUsers
