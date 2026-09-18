const DEFAULT_MESSAGES: Record<string, string> = {
  payment_failed:
    "Le paiement n'a pas abouti. Aucun débit n'a été confirmé; vous pouvez réessayer.",
  order_failed:
    "Le paiement n'a pas pu être rattaché à une commande. Contactez-nous avant de réessayer.",
}

type PaymentErrorProps = {
  code?: string
  paymentFailedText?: string
  orderFailedText?: string
}

const PaymentError = ({
  code,
  paymentFailedText,
  orderFailedText,
}: PaymentErrorProps) => {
  const messages: Record<string, string | undefined> = {
    payment_failed: paymentFailedText || DEFAULT_MESSAGES.payment_failed,
    order_failed: orderFailedText || DEFAULT_MESSAGES.order_failed,
  }
  const message = code ? messages[code] : undefined

  if (!message) {
    return null
  }

  return (
    <div
      className="mb-6 border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700"
      role="alert"
      data-testid="payment-error"
    >
      {message}
    </div>
  )
}

export default PaymentError