import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { sendNotificationsStep } from "@medusajs/core-flows"

export type SendEmailNotificationWorkflowInput = {
  to: string
  subject: string
  html: string
  trigger_type: string
  resource_id?: string
  resource_type?: string
  idempotency_key?: string
}

export const sendEmailNotificationWorkflow = createWorkflow(
  "send-email-notification",
  (input: SendEmailNotificationWorkflowInput) => {
    const notifications = sendNotificationsStep([
      {
        to: input.to,
        channel: "email",
        trigger_type: input.trigger_type,
        resource_id: input.resource_id,
        resource_type: input.resource_type,
        idempotency_key: input.idempotency_key,
        content: {
          subject: input.subject,
          html: input.html,
        },
      },
    ])

    return new WorkflowResponse(notifications)
  }
)
