import crypto from "crypto"
import type {
  InitiatePaymentInput,
  ProviderWebhookPayload,
} from "@medusajs/framework/types"
import JekoPaymentProviderService from "../service"

const options = {
  api_key: "api-key",
  api_key_id: "api-key-id",
  store_id: "store-id",
  webhook_secret: "webhook-secret",
  api_url: "https://api.jeko.africa/partner_api",
  amount_multiplier: 100,
}

const createService = () =>
  new JekoPaymentProviderService({ logger: {} as never }, options)

describe("JekoPaymentProviderService", () => {
  const storefrontUrl = process.env.STOREFRONT_URL

  beforeAll(() => {
    process.env.STOREFRONT_URL = "https://store.test"
  })

  afterAll(() => {
    process.env.STOREFRONT_URL = storefrontUrl
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("creates a redirect payment request using Jeko cents", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "request-id",
          storeId: "store-id",
          reference: "payment-session-id",
          type: "redirect",
          paymentMethod: "wave",
          status: "pending",
          redirectUrl: "https://pay.jeko.africa/request-id",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )

    const result = await createService().initiatePayment({
      amount: 125,
      currency_code: "xof",
      data: {
        session_id: "payment-session-id",
        paymentMethod: "wave",
        cart_id: "cart-id",
        country_code: "CI",
      },
    } as InitiatePaymentInput)

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.jeko.africa/partner_api/payment_requests",
      expect.objectContaining({ method: "POST" })
    )

    const request = fetchMock.mock.calls[0][1] as RequestInit
    expect(request.headers).toMatchObject({
      "X-API-KEY": "api-key",
      "X-API-KEY-ID": "api-key-id",
    })
    expect(JSON.parse(request.body as string)).toEqual({
      storeId: "store-id",
      amountCents: 12500,
      currency: "XOF",
      reference: "payment-session-id",
      paymentDetails: {
        type: "redirect",
        data: {
          paymentMethod: "wave",
          successUrl:
            "https://store.test/api/payment-return/jeko?outcome=success&cart_id=cart-id&session_id=payment-session-id&country_code=ci",
          errorUrl:
            "https://store.test/api/payment-return/jeko?outcome=error&cart_id=cart-id&session_id=payment-session-id&country_code=ci",
        },
      },
    })
    expect(result).toMatchObject({
      id: "request-id",
      status: "pending",
      data: {
        paymentRequestId: "request-id",
        reference: "payment-session-id",
        paymentMethod: "wave",
        redirectUrl: "https://pay.jeko.africa/request-id",
      },
    })
  })

  it("rejects non-XOF payment sessions", async () => {
    await expect(
      createService().initiatePayment({
        amount: 125,
        currency_code: "eur",
        data: {
          session_id: "payment-session-id",
          paymentMethod: "wave",
          cart_id: "cart-id",
          country_code: "FR",
        },
      } as InitiatePaymentInput)
    ).rejects.toThrow("only enabled for XOF")
  })

  it("rejects amounts that do not convert to positive Jeko cents", async () => {
    await expect(
      createService().initiatePayment({
        amount: 0,
        currency_code: "xof",
        data: {
          session_id: "payment-session-id",
          paymentMethod: "wave",
          cart_id: "cart-id",
        },
      } as InitiatePaymentInput)
    ).rejects.toThrow("positive integer")
  })

  it("rejects invalid provider contract options", () => {
    expect(() =>
      JekoPaymentProviderService.validateOptions({
        ...options,
        api_url: "http://api.jeko.test",
      })
    ).toThrow("valid HTTPS URL")

    expect(() =>
      JekoPaymentProviderService.validateOptions({
        ...options,
        amount_multiplier: 0,
      })
    ).toThrow("positive integer")
  })

  it("accepts a correctly signed successful transaction webhook", async () => {
    const data = {
      id: "transaction-id",
      status: "success",
      amount: { amount: 12500, currency: "XOF" },
      transactionDetails: {
        id: "request-id",
        reference: "payment-session-id",
      },
    }
    const rawData = JSON.stringify(data)
    const signature = crypto
      .createHmac("sha256", options.webhook_secret)
      .update(rawData)
      .digest("hex")

    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "request-id",
          storeId: "store-id",
          reference: "payment-session-id",
          paymentMethod: "wave",
          amountCents: 12500,
          currency: "XOF",
          status: "success",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )

    const result = await createService().getWebhookActionAndData({
      data,
      rawData,
      headers: { "jeko-signature": signature },
    } as ProviderWebhookPayload["payload"])

    expect(result.action).toBe("captured")
    expect(result.data?.session_id).toBe("payment-session-id")
    expect(Number(result.data?.amount.toString())).toBe(125)
  })

  it("requires more action while Jeko still reports the payment as pending", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "request-id",
          storeId: "store-id",
          reference: "payment-session-id",
          type: "redirect",
          paymentMethod: "wave",
          status: "pending",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )

    const result = await createService().authorizePayment({
      data: {
        paymentRequestId: "request-id",
        reference: "payment-session-id",
        paymentMethod: "wave",
        amountCents: 12500,
        currency: "XOF",
        storeId: "store-id",
      },
    })

    expect(result.status).toBe("requires_more")
  })

  it("reports a successful Jeko payment as captured", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "request-id",
          storeId: "store-id",
          reference: "payment-session-id",
          type: "redirect",
          paymentMethod: "wave",
          status: "success",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )

    const result = await createService().authorizePayment({
      data: {
        paymentRequestId: "request-id",
        reference: "payment-session-id",
        paymentMethod: "wave",
        amountCents: 12500,
        currency: "XOF",
        storeId: "store-id",
      },
    })

    expect(result.status).toBe("captured")
  })

  it("rejects a webhook with an invalid signature", async () => {
    const data = {
      status: "success",
      amount: { amount: 12500, currency: "XOF" },
      transactionDetails: { reference: "payment-session-id" },
    }

    await expect(
      createService().getWebhookActionAndData({
        data,
        rawData: JSON.stringify(data),
        headers: { "jeko-signature": "invalid" },
      } as ProviderWebhookPayload["payload"])
    ).rejects.toThrow("Invalid Jèko webhook signature")
  })

  it("rejects a webhook that does not match its payment request", async () => {
    const data = {
      id: "transaction-id",
      status: "success",
      amount: { amount: 12500, currency: "XOF" },
      transactionDetails: {
        id: "request-id",
        reference: "payment-session-id",
      },
    }
    const rawData = JSON.stringify(data)
    const signature = crypto
      .createHmac("sha256", options.webhook_secret)
      .update(rawData)
      .digest("hex")

    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "request-id",
          storeId: "another-store",
          reference: "payment-session-id",
          paymentMethod: "wave",
          amountCents: 12500,
          currency: "XOF",
          status: "success",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )

    await expect(
      createService().getWebhookActionAndData({
        data,
        rawData,
        headers: { "jeko-signature": signature },
      } as ProviderWebhookPayload["payload"])
    ).rejects.toThrow("does not match")
  })

  it("rejects a status response for a different reference", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "request-id",
          storeId: "store-id",
          reference: "another-session",
          type: "redirect",
          paymentMethod: "wave",
          status: "success",
          amountCents: 12500,
          currency: "XOF",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )

    await expect(
      createService().getPaymentStatus({
        data: {
          paymentRequestId: "request-id",
          reference: "payment-session-id",
          paymentMethod: "wave",
          amountCents: 12500,
          currency: "XOF",
          storeId: "store-id",
        },
      })
    ).rejects.toThrow("inconsistent reference")
  })

  it("rejects an amount change after payment initiation", async () => {
    await expect(
      createService().updatePayment({
        amount: 126,
        currency_code: "xof",
        data: {
          paymentRequestId: "request-id",
          reference: "payment-session-id",
          paymentMethod: "wave",
          amountCents: 12500,
          currency: "XOF",
          storeId: "store-id",
        },
      } as never)
    ).rejects.toThrow("cannot be changed")
  })

  it("uses the configured multiplier when validating an unchanged amount", async () => {
    const service = new JekoPaymentProviderService(
      { logger: {} as never },
      { ...options, amount_multiplier: 1 }
    )

    await expect(
      service.updatePayment({
        amount: 125,
        currency_code: "xof",
        data: {
          paymentRequestId: "request-id",
          reference: "payment-session-id",
          paymentMethod: "wave",
          amountCents: 125,
          currency: "XOF",
          storeId: "store-id",
        },
      } as never)
    ).resolves.toMatchObject({ data: { amountCents: 125 } })
  })
})