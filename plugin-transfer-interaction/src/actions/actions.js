import {
  Actions,
  TaskHelper,
  Manager,
  Notifications,
  StateHelper
} from '@twilio/flex-ui'
import fetch from 'node-fetch'

const URL_TRANSFER_INTERACTION = process.env.FLEX_APP_URL_TRANSFER_INTERACTION

const getAgent = async payload => {
  const participants = await payload.task.getParticipants(
    payload.task.attributes.flexInteractionChannelSid
  )

  let agent
  for (const p of participants) {
    if (p.type === 'agent') {
      agent = p
      break
    }
  }

  return agent
}

const closeParticipantAndtransfer = async (payload, original) => {
  if (!TaskHelper.isCBMTask(payload.task)) {
    return original(payload)
  }

  const agent = await getAgent(payload)
  const manager = Manager.getInstance()

  const body = {
    interactionSid: agent.interactionSid,
    channelSid: agent.channelSid,
    participantSid: agent.participantSid,
    workflowSid: payload.task.workflowSid,
    taskChannelUniqueName: payload.task.taskChannelUniqueName,
    taskAttributes: payload.task.attributes,
    targetSid: payload.targetSid,
    workerName: manager.user.identity
  }

  try {
    await fetch(URL_TRANSFER_INTERACTION, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    })

    return Notifications.showNotification('transferredNotification')
  } catch (error) {
    console.error(error)
    Notifications.showNotification('errorTransferredNotification', {
      message: error.message
    })

    /*
     * If we encounter an error with the transfer-interaction function we do not
     * want to leave the customer with no one in the conversation.
     */
    const channel = StateHelper.getConversationStateForTask(payload.task)
    if (channel) {
      await channel.source.join()
    }
  }
}

Actions.replaceAction('TransferTask', (payload, original) =>
  closeParticipantAndtransfer(payload, original)
)
