const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient()
  const workspaceSid = context.WORKSPACE_SID

  console.log('event')
  console.log(event)

  const interactionSid = event.interactionSid
  const channelSid = event.channelSid
  const participantSid = event.participantSid
  const workflowSid = event.workflowSid
  const taskChannelUniqueName = event.taskChannelUniqueName
  const taskAttributes = event.taskAttributes

  try {
    // First close participant
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .participants(participantSid)
      .update({ status: 'closed' })
      .then(interaction_channel_participant => {
        console.log('interaction_channel_participant')
        console.log(interaction_channel_participant)
      })

    // Create a new task through the invites endpoint. Alternatively you can pass
    // a queue_sid and a worker_sid inside properties to add a specific agent back to the interation
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .invites.create({
        routing: {
          properties: {
            workspace_sid: workspaceSid,
            workflow_sid: workflowSid,
            task_channel_unique_name: taskChannelUniqueName,
            attributes: taskAttributes
          }
        }
      })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
