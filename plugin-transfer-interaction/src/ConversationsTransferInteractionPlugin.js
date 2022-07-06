import React from 'react'
import { FlexPlugin } from '@twilio/flex-plugin'
import { CustomizationProvider } from '@twilio-paste/core/customization'

import './actions'
import './notifications'
import { TransferButton } from './components'

const PLUGIN_NAME = 'ConversationsTransferInteractionPlugin'

export default class ConversationsTransferInteractionPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    })

    flex.TaskCanvasHeader.Content.add(
      <TransferButton key='conversation-transfer-button' />,
      {
        sortOrder: 1,
        if: props =>
          props.channelDefinition.capabilities.has('Chat') &&
          props.task.taskStatus === 'assigned'
      }
    )
  }
}
