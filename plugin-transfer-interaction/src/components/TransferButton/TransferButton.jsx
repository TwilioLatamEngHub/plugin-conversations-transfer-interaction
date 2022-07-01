import React, { useState } from 'react'
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

  /*
   *  The logic for the loading spinner to improve UX here is the following:
   *  When the forward button is clicked, the loading is set to true. But we
   *  need to remove the spinner in case the user only closes the directory
   *  without transfering, that's why we add a listener to set to false on
   *  beforeHideDirectory. Finally we set the loading to true again afterTransferTask.
   */

  const handleLoader = () => {
    setIsLoading(true)
    Actions.invokeAction('ShowDirectory')
  }

  Actions.addListener('beforeHideDirectory', () => {
    setIsLoading(false)
    Actions.addListener('afterTransferTask', () => {
      setIsLoading(true)
    })
  })

  return (
    <Theme.Provider theme='default'>
      {isLoading ? (
        <IconWrapper isLoading={isLoading}>
          <Spinner size='sizeIcon40' decorative={false} title='Loading' />
        </IconWrapper>
      ) : (
        <IconWrapper onClick={handleLoader}>
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
