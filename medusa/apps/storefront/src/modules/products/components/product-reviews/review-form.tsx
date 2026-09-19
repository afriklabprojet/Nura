"use client"

import { useActionState, useState } from "react"

import { createReview, CreateReviewState } from "@lib/data/reviews"
import { Button, Input, Label, Text, Textarea } from "@modules/common/components/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import StarRating from "../star-rating"

const initialState: CreateReviewState = { success: false, error: null }

const ReviewForm = ({
  productId,
  successMessage,
}: {
  productId: string
  successMessage?: string
}) => {
  const [rating, setRating] = useState(0)
  const [state, formAction, isPending] = useActionState(
    createReview,
    initialState
  )

  if (state.success) {
    return (
      <Text className="text-ui-fg-subtle" role="status">
        {successMessage ||
          "Merci ! Votre avis a été envoyé et sera visible après validation."}
      </Text>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-y-3 max-w-md">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="flex flex-col gap-y-1">
        <Label>Votre note</Label>
        <StarRating value={rating} interactive size="large" onChange={setRating} />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="review-title">Titre (facultatif)</Label>
        <Input id="review-title" name="title" maxLength={120} />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="review-content">Votre avis</Label>
        <Textarea id="review-content" name="content" required rows={4} />
      </div>

      <ErrorMessage error={state.error} data-testid="review-error-message" />

      <Button type="submit" isLoading={isPending} disabled={rating === 0}>
        Publier mon avis
      </Button>
    </form>
  )
}

export default ReviewForm
