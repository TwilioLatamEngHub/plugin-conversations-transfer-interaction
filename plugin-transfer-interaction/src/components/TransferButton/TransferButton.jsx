import React from 'react'
import styled from 'styled-components'
import { Actions } from '@twilio/flex-ui'

import { SkipForwardIcon } from '@twilio-paste/icons/esm/SkipForwardIcon'
import { Theme } from '@twilio-paste/core/theme'

const IconWrapper = styled.div`
  margin: 1rem;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
`

export const TransferButton = () => {
  return (
    <Theme.Provider theme='default'>
      <IconWrapper onClick={() => Actions.invokeAction('ShowDirectory')}>
        <SkipForwardIcon decorative={false} title='Transfer Conversation' />
      </IconWrapper>
    </Theme.Provider>
  )
}
