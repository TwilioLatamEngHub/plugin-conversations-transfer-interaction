import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Actions } from '@twilio/flex-ui'

import { Theme } from '@twilio-paste/core/theme'
import { Spinner } from '@twilio-paste/core/spinner'
import { SkipForwardIcon } from '@twilio-paste/icons/esm/SkipForwardIcon'

const IconWrapper = styled.div`
  margin: 0.8rem;
  color: #fff;
  cursor: ${props => (props.isLoading ? 'not-allowed' : 'pointer')};
`

export const TransferButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(
    () => Actions.addListener('beforeTransferTask', () => setIsLoading(true)),
    []
  )

  return (
    <Theme.Provider theme='default'>
      {isLoading ? (
        <IconWrapper isLoading={isLoading}>
          <Spinner size='sizeIcon40' decorative={false} title='Loading' />
        </IconWrapper>
      ) : (
        <IconWrapper onClick={() => Actions.invokeAction('ShowDirectory')}>
          <SkipForwardIcon
            size='sizeIcon40'
            decorative={false}
            title='Transfer Conversation'
          />
        </IconWrapper>
      )}
    </Theme.Provider>
  )
}
