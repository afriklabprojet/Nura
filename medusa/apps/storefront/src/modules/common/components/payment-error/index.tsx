const messages: Record<string, string> = {
  payment_failed:
    "Le paiement n'a pas abouti. Aucun débit n'a été confirmé; vous pouvez réessayer.",
  order_failed:
    "Le paiement n'a pas pu être rattaché à une commande. Contactez-nous avant de réessayer.",
}

const PaymentError = ({ code }: { code?: string }) => {
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