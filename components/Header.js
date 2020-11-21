import React from "react"
import styled from "styled-components"

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: center;
`

function Header({ channelName }) {
  return (
    <HeaderWrapper>
      <h5 className="ui header">#{channelName}</h5>
    </HeaderWrapper>
  )
}

export default Header
