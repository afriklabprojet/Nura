"use client"

import { clx } from "@modules/common/components/ui"
import { useSearchParams } from "next/navigation"

const steps = [
  { key: "address", label: "Adresse" },
  { key: "delivery", label: "Livraison" },
  { key: "payment", label: "Paiement" },
]

const CheckoutSteps = () => {
  const searchParams = useSearchParams()
  const current = searchParams.get("step") || "address"
  const currentIndex = Math.max(
    steps.findIndex((step) => step.key === current),
    0
  )

  return (
    <ol className="mb-10 flex items-center gap-4 border-b border-nude pb-6">
      {steps.map((step, index) => (
        <li key={step.key} className="flex items-center gap-4">
          <span
            className={clx(
              "flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]",
              index <= currentIndex ? "text-brown" : "text-ui-fg-muted"
            )}
          >
            <span
              className={clx(
                "flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                index < currentIndex && "border-gold bg-gold text-bg-alt",
                index === currentIndex && "border-brown text-brown",
                index > currentIndex && "border-nude text-ui-fg-muted"
              )}
            >
              {index + 1}
            </span>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <span className="h-px w-6 bg-nude small:w-10" />
          )}
        </li>
      ))}
    </ol>
  )
}

export default CheckoutSteps
