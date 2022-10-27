import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Actions, Manager } from '@twilio/flex-ui'

import { Spinner } from '@twilio-paste/core/spinner'
import { SkipForwardIcon } from '@twilio-paste/icons/esm/SkipForwardIcon'

const IconWrapper = styled.div`
  margin: 0.8rem;
  cursor: ${props => (props.isLoading ? 'not-allowed' : 'pointer')};
`

export const TransferButton = () => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    Actions.addListener('beforeTransferTask', () => setIsLoading(true))
  }, [])

  // TODO: hide the call icon from the directory

  // const targetElement = document.getElementsByClassName(
  //   'Twilio-WorkerDirectory-ButtonContainer'
  // )
  // if (targetElement) {
  //   targetElement.forEach(icon => (icon.firstChild.style.display = 'none'))
  // }

  // const queue = document.getElementsByClassName('Twilio-WorkerDirectory-Queue')
  // const queueContent = document.getElementsByClassName(
  //   'Twilio-WorkerDirectory-QueueContent'
  // )

  // if (queue.length > 0) {
  //   const queueArr = Array.from(queue)

  //   queueArr.forEach(() => {
  //     const queueContentArr = Array.from(queueContent)

  //     queueContentArr.forEach(queueContent => {
  //       if (queueContent.innerText === 'Test Queue') {
  //         queueContent.parentNode.remove()
  //       }
  //     })
  //   })
  // }

  return (
    <>
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
    </>
  )
}
