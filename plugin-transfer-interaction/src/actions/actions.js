import { Actions, TaskHelper } from '@twilio/flex-ui'
import fetch from 'node-fetch'

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

async function closeParticipantAndtransfer(payload, original) {
  if (!TaskHelper.isCBMTask(payload.task)) {
    return original(payload)
  }

  const agent = await getAgent(payload)

  const body = {
    interactionSid: agent.interactionSid,
    channelSid: agent.channelSid,
    participantSid: agent.participantSid,
    workflowSid: payload.task.workflowSid,
    taskChannelUniqueName: payload.task.taskChannelUniqueName,
    taskAttributes: payload.task.attributes
  }

  try {
    const res = await fetch(
      'https://serverless-transfer-interaction-1420-dev.twil.io/transfer-interaction',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
      }
    )

    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

export const setUpActions = () => {
  Actions.replaceAction('TransferTask', (payload, original) =>
    closeParticipantAndtransfer(payload, original)
  )
}
