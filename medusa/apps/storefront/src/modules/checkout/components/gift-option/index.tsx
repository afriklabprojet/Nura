"use client"

import { updateCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, Textarea } from "@modules/common/components/ui"
import { useState, useTransition } from "react"

const GiftOption = ({
  cart,
  text,
}: {
  cart: HttpTypes.StoreCart
  text?: string
}) => {
  const metadata = (cart.metadata || {}) as Record<string, unknown>
  const [wrapped, setWrapped] = useState(metadata.gift_wrap === true)
  const [message, setMessage] = useState(
    typeof metadata.gift_message === "string" ? metadata.gift_message : ""
  )
  const [isPending, startTransition] = useTransition()

  const save = (nextWrapped: boolean, nextMessage: string) => {
    startTransition(async () => {
      await updateCart({
        metadata: {
          ...metadata,
          gift_wrap: nextWrapped,
          gift_message: nextWrapped ? nextMessage : "",
        },
      })
    })
  }

  const toggle = () => {
    const next = !wrapped
    setWrapped(next)
    save(next, message)
  }

  return (
    <Container className="p-6">
      <Heading level="h3" className="mb-3">
        Emballage cadeau
      </Heading>
      <label className="flex items-start gap-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={wrapped}
          onChange={toggle}
          disabled={isPending}
          className="mt-1 accent-gold"
        />
        <Text className="text-ui-fg-subtle">
          {text ||
            "Emballer ma commande dans un écrin Nura, offert — idéal pour un cadeau."}
        </Text>
      </label>

      {wrapped && (
        <div className="mt-4">
          <Textarea
            label="Message personnalisé (facultatif)"
            value={message}
            maxLength={300}
            rows={3}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={() => save(wrapped, message)}
            placeholder="Un mot pour la personne qui recevra ce cadeau..."
          />
        </div>
      )}
    </Container>
  )
}

export default GiftOption
