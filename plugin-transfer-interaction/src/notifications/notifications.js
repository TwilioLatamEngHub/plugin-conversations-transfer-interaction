import { Notifications, NotificationType } from '@twilio/flex-ui'

Notifications.registerNotification({
  id: 'transferredNotification',
  closeButton: true,
  content: 'Conversation was transferred successfully!',
  timeout: 3000,
  type: NotificationType.success
})

Notifications.registerNotification({
  id: 'errorTransferredNotification',
  closeButton: true,
  content: 'An error has ocurred',
  timeout: 3000,
  type: NotificationType.error
})
