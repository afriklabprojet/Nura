import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Badge, Container, Heading, Text } from "@medusajs/ui"

const OrderGiftWrapWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const metadata = (data.metadata || {}) as Record<string, unknown>

  if (metadata.gift_wrap !== true) {
    return null
  }

  return (
    <Container className="p-0">
      <div className="flex items-center gap-x-2 px-6 py-4">
        <Heading level="h2">Emballage cadeau demandé</Heading>
        <Badge color="purple">Cadeau</Badge>
      </div>
      {typeof metadata.gift_message === "string" && metadata.gift_message && (
        <div className="px-6 pb-4">
          <Text className="text-ui-fg-subtle italic">
            « {metadata.gift_message} »
          </Text>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderGiftWrapWidget
