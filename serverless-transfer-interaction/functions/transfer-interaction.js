const path = Runtime.getFunctions()['response-header'].path
const response = require(path).response()

exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient()
  const workspaceSid = context.WORKSPACE_SID

  const {
    interactionSid,
    channelSid,
    participantSid,
    workflowSid,
    taskChannelUniqueName,
    taskAttributes,
    targetSid,
    workerName
  } = event

  let newAttributes = taskAttributes

  /*
   * update task attributes to ignore the agent who transferred the task
   * it's possible that the agent who transferred the task is in the queue
   * the task is being transferred to - but we don't want them to
   * receive a task they just transferred. It's also possible the agent
   * is simply transferring to the same queue the task is already in
   * once again, we don't want the transferring agent to receive the task
   */
  newAttributes.ignoreAgent = workerName

  /*
   * update task attributes to include the required targetSid on the task
   * this could either be a workerSid or a queueSid
   */
  newAttributes.targetSid = targetSid

  // add an attribute that will tell our Workflow if we're transferring to a worker or a queue
  const isWorkerTransfer = targetSid.startsWith('WK')
  if (isWorkerTransfer) {
    newAttributes.transferTargetType = 'worker'
  } else {
    newAttributes.transferTargetType = 'queue'
  }

  try {
    // create a new task through the invites endpoint
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .invites.create({
        routing: {
          properties: {
            workspace_sid: workspaceSid,
            workflow_sid: workflowSid,
            task_channel_unique_name: taskChannelUniqueName,
            attributes: newAttributes
          }
        }
      })

    // close the participant
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .participants(participantSid)
      .update({ status: 'closed' })
      .then(interaction_channel_participant => {
        console.log('interaction_channel_participant')
        console.log(interaction_channel_participant)
      })

    callback(null, response)
  } catch (error) {
    console.log(error)
    callback(error)
  }
}
