import {
  AbstractPaymentProvider,
  BigNumber,
  MedusaError,
} from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import type {
  InitiatePaymentInput,
  InitiatePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  ProviderWebhookPayload,
  WebhookActionResult,
  PaymentSessionStatus,
} from "@medusajs/framework/types"
import crypto from "crypto"

type Options = {
  api_key: string
  api_key_id: string
  store_id: string
  webhook_secret: string
}

type InjectedDependencies = {
  logger: Logger
}

const JEKO_API_URL = "https://api.jeko.africa/partner_api"

const JEKO_PAYMENT_METHODS = ["wave", "orange", "mtn", "moov", "djamo"] as const
type JekoPaymentMethod = (typeof JEKO_PAYMENT_METHODS)[number]

type JekoPaymentRequestResponse = {
  id: string
  storeId: string
  reference: string
  type: string
  paymentMethod: string
  amountCents?: number
  currency?: string
  status: "pending" | "success" | "error"
  redirectUrl?: string
  errorReason?: string | null
}

type JekoSessionData = {
  paymentRequestId: string
  reference: string
  paymentMethod: JekoPaymentMethod
  redirectUrl?: string
  jekoStatus?: string
  amountCents: number
  currency: string
  storeId: string
}

// Jèko's own hosted checkout confirms mobile money payments (Wave, Orange
// Money, MTN, Moov, Djamo) immediately — there's no separate authorize-then-
// capture step like a credit card. "success" is final and settled.
function mapJekoStatus(status: string): PaymentSessionStatus {
  switch (status) {
    case "success":
      return "captured"
    case "error":
      return "error"
    default:
      return "pending"
  }
}

class JekoPaymentProviderService extends AbstractPaymentProvider<Options> {
  static identifier = "jeko"

  protected logger_: Logger
  protected options_: Options

  constructor(cradle: InjectedDependencies, options: Options) {
    super(cradle, options)
    this.logger_ = cradle.logger
    this.options_ = options
  }

  static validateOptions(options: Record<string, unknown>) {
    for (const key of ["api_key", "api_key_id", "store_id", "webhook_secret"]) {
      if (!options[key]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `${key} is required in the Jèko payment provider's options.`
        )
      }
    }
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${JEKO_API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": this.options_.api_key,
        "X-API-KEY-ID": this.options_.api_key_id,
        ...(init.headers as Record<string, string> | undefined),
      },
    })

    const body = await response.json().catch(() => null)

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Jèko API error (${response.status}): ${
          body?.message ?? body?.errorReason ?? response.statusText
        }`
      )
    }

    return body as T
  }

  private async getPaymentRequest(
    paymentRequestId: string
  ): Promise<JekoPaymentRequestResponse> {
    return this.request<JekoPaymentRequestResponse>(
      `/payment_requests/${paymentRequestId}`,
      { method: "GET" }
    )
  }

  private validatePaymentRequest(
    response: JekoPaymentRequestResponse,
    expected: JekoSessionData
  ) {
    const mismatches = [
      response.id !== expected.paymentRequestId && "payment request",
      response.reference !== expected.reference && "reference",
      response.storeId !== expected.storeId && "store",
      response.paymentMethod !== expected.paymentMethod && "payment method",
      response.amountCents !== undefined &&
        response.amountCents !== expected.amountCents &&
        "amount",
      response.currency !== undefined &&
        response.currency.toUpperCase() !== expected.currency &&
        "currency",
    ].filter(Boolean)

    if (mismatches.length) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Jèko returned inconsistent ${mismatches.join(", ")} data.`
      )
    }
  }

  // Called once the customer has picked a mobile money wallet in the
  // storefront's Jèko payment step — see the `data.paymentMethod` it sends.
  // Until then, the storefront simply doesn't call this (no Jèko API call
  // happens without knowing which wallet to redirect to).
  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, data } = input
    const sessionId = data?.session_id as string | undefined
    const paymentMethod = data?.paymentMethod as JekoPaymentMethod | undefined
    const cartId = data?.cart_id as string | undefined

    if (!sessionId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Missing session_id for Jèko payment."
      )
    }

    if (!paymentMethod || !JEKO_PAYMENT_METHODS.includes(paymentMethod)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `A valid Jèko paymentMethod (${JEKO_PAYMENT_METHODS.join(", ")}) is required to initiate this payment.`
      )
    }

    if (!cartId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Missing cart_id for Jèko payment."
      )
    }

    const countryCode = data?.country_code as string | undefined
    const storefrontUrl = process.env.STOREFRONT_URL
    if (!storefrontUrl && process.env.NODE_ENV === "production") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "STOREFRONT_URL is required for Jèko payments in production."
      )
    }

    const createReturnUrl = (outcome: "success" | "error") => {
      const url = new URL(
        "/api/payment-return/jeko",
        storefrontUrl || "http://localhost:8000"
      )
      url.searchParams.set("outcome", outcome)
      url.searchParams.set("cart_id", cartId)
      url.searchParams.set("session_id", sessionId)

      if (countryCode && /^[a-z]{2}$/i.test(countryCode)) {
        url.searchParams.set("country_code", countryCode.toLowerCase())
      }

      return url.toString()
    }

    const successUrl = createReturnUrl("success")
    const errorUrl = createReturnUrl("error")

    // NOTE: Jèko's `amountCents` field is a multiple of 100 even for XOF (a
    // currency with no minor unit in everyday use) — confirmed against their
    // own sample payload (10000 amountCents for a small "test payment").
    // Verify this against a real Jèko test transaction before going live.
    const amountCents = Math.round(Number(amount) * 100)

    const response = await this.request<JekoPaymentRequestResponse>(
      "/payment_requests",
      {
        method: "POST",
        body: JSON.stringify({
          storeId: this.options_.store_id,
          amountCents,
          currency: currency_code.toUpperCase(),
          reference: sessionId,
          paymentDetails: {
            type: "redirect",
            data: {
              paymentMethod,
              successUrl,
              errorUrl,
            },
          },
        }),
      }
    )

    if (
      response.reference !== sessionId ||
      response.storeId !== this.options_.store_id ||
      response.paymentMethod !== paymentMethod
    ) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Jèko returned payment data that does not match the request."
      )
    }

    const sessionData: JekoSessionData = {
      paymentRequestId: response.id,
      reference: sessionId,
      paymentMethod,
      redirectUrl: response.redirectUrl,
      jekoStatus: response.status,
      amountCents,
      currency: currency_code.toUpperCase(),
      storeId: this.options_.store_id,
    }

    return {
      id: response.id,
      status: "pending",
      data: sessionData as unknown as Record<string, unknown>,
    }
  }

  // Mobile money confirmation happens off-site. A pending request needs more
  // customer action and must not create an unpaid order. Once Jèko confirms
  // success, the return flow or webhook authorizes and captures the payment.
  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const data = input.data as unknown as JekoSessionData

    if (!data?.paymentRequestId) {
      return { status: "requires_more", data: input.data }
    }

    const response = await this.getPaymentRequest(data.paymentRequestId)
    this.validatePaymentRequest(response, data)
    const status = mapJekoStatus(response.status)

    return {
      status: status === "pending" ? "requires_more" : status,
      data: { ...data, jekoStatus: response.status } as unknown as Record<
        string,
        unknown
      >,
    }
  }

  // Jèko settles mobile money payments immediately on success — there is no
  // separate capture step to trigger via their API, so this just confirms
  // the current state rather than performing a new action.
  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: input.data }
  }

  // No cancel/void endpoint is documented for Jèko payment requests.
  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: input.data }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    const data = input.data as unknown as JekoSessionData
    const amountCents = Math.round(Number(input.amount) * 100)

    if (!data?.amountCents || amountCents !== data.amountCents) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "A Jèko payment amount cannot be changed after initiation. Create a new payment session."
      )
    }

    return { data: input.data }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const data = input.data as unknown as JekoSessionData

    if (!data?.paymentRequestId) {
      return { status: "pending" }
    }

    const response = await this.getPaymentRequest(data.paymentRequestId)
    this.validatePaymentRequest(response, data)

    return {
      status: mapJekoStatus(response.status),
      data: { ...data, jekoStatus: response.status } as unknown as Record<
        string,
        unknown
      >,
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    const data = input.data as unknown as JekoSessionData

    if (!data?.paymentRequestId) {
      return { data: input.data }
    }

    const response = await this.getPaymentRequest(data.paymentRequestId)
    return { data: response as unknown as Record<string, unknown> }
  }

  // Jèko doesn't document a refund endpoint. Returning fake success here
  // would tell an admin money was returned when it wasn't — throw instead so
  // refunds for Jèko payments are handled manually (Jèko dashboard / direct
  // mobile money transfer to the customer) until they add one.
  async refundPayment(_input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "Jèko doesn't support refunds via its API yet. Refund this payment manually (Jèko dashboard or a direct mobile money transfer) and record it outside Medusa."
    )
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data, rawData, headers } = payload

    const signature = (headers["jeko-signature"] ??
      headers["Jeko-Signature"]) as string | undefined

    if (!signature) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Missing Jeko-Signature header on Jèko webhook."
      )
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.options_.webhook_secret)
      .update(rawData)
      .digest("hex")

    const signatureIsValid =
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )

    if (!signatureIsValid) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Invalid Jèko webhook signature."
      )
    }

    const sessionId = (
      data.transactionDetails as Record<string, unknown> | undefined
    )?.reference as string | undefined
    const amountValue = (data.amount as Record<string, unknown> | undefined)
      ?.amount as number | undefined

    if (!sessionId) {
      // Nothing we can correlate back to a Medusa payment session.
      return {
        action: "not_supported",
      }
    }

    const amount = new BigNumber((amountValue ?? 0) / 100)

    switch (data.status) {
      case "success":
        return {
          action: "captured",
          data: { session_id: sessionId, amount },
        }
      case "error":
        return {
          action: "failed",
          data: { session_id: sessionId, amount },
        }
      default:
        return { action: "not_supported" }
    }
  }
}

export default JekoPaymentProviderService
