import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { Resend } from "resend"

type InjectedDependencies = {
  logger: Logger
}

type Options = {
  api_key: string
  from: string
}

class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend-notification"

  protected logger_: Logger
  protected config_: Options
  protected client_: Resend

  constructor({ logger }: InjectedDependencies, options: Options) {
    super()
    this.logger_ = logger
    this.config_ = options
    this.client_ = new Resend(options.api_key)
  }

  static validateOptions(options: Record<string, unknown>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "api_key is required in the Resend notification provider's options."
      )
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "from is required in the Resend notification provider's options."
      )
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "No notification information provided"
      )
    }

    const from = notification.from?.trim() || this.config_.from

    const content =
      "content" in notification ? notification.content : undefined

    const { data, error } = await this.client_.emails.send({
      from,
      to: notification.to,
      subject: content?.subject ?? "Nura",
      html: content?.html ?? "",
    })

    if (error) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send email via Resend: ${error.message}`
      )
    }

    this.logger_.info(`Sent email via Resend (id: ${data?.id})`)

    return { id: data?.id }
  }
}

export default ResendNotificationService
