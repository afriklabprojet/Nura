import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { Badge, Button, Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Review = {
  id: string
  customer_name: string
  rating: number
  title: string | null
  content: string
  verified_purchase: boolean
  status: "pending" | "approved" | "rejected"
  created_at: string
}

const ProductReviewsWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingActionId, setPendingActionId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/admin/reviews?product_id=${encodeURIComponent(data.id)}&status=pending`,
        { credentials: "include" }
      )
      const json = await res.json()
      setReviews(json.reviews ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [data.id])

  const moderate = async (reviewId: string, status: "approved" | "rejected") => {
    setPendingActionId(reviewId)
    try {
      await fetch(`/admin/reviews/${reviewId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      setReviews((prev) => prev.filter((r) => r.id !== reviewId))
    } finally {
      setPendingActionId(null)
    }
  }

  if (!loading && reviews.length === 0) {
    return null
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-2">
          <Heading level="h2">Avis en attente de modération</Heading>
          {reviews.length > 0 && <Badge color="orange">{reviews.length}</Badge>}
        </div>
      </div>
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-y-2 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Text weight="plus">{review.customer_name}</Text>
              <Text className="text-ui-fg-subtle">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </Text>
              {review.verified_purchase && (
                <Badge color="green" size="2xsmall">
                  Achat vérifié
                </Badge>
              )}
            </div>
            <Text size="small" className="text-ui-fg-muted">
              {new Date(review.created_at).toLocaleDateString("fr-FR")}
            </Text>
          </div>
          {review.title && <Text weight="plus">{review.title}</Text>}
          <Text className="text-ui-fg-subtle">{review.content}</Text>
          <div className="flex gap-x-2">
            <Button
              size="small"
              variant="secondary"
              disabled={pendingActionId === review.id}
              onClick={() => moderate(review.id, "approved")}
            >
              Approuver
            </Button>
            <Button
              size="small"
              variant="danger"
              disabled={pendingActionId === review.id}
              onClick={() => moderate(review.id, "rejected")}
            >
              Rejeter
            </Button>
          </div>
        </div>
      ))}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductReviewsWidget
